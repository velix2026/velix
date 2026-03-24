import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// إعدادات Google Drive
let auth: any = null;

function getAuth() {
  if (!auth) {
    auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
  }
  return auth;
}

const drive = google.drive({ version: 'v3', auth: getAuth() });

// قراءة المنتجات من الملف
function getProducts() {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// حفظ المنتجات في الملف
function saveProducts(products: any[]) {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

// رفع صورة إلى Google Drive
async function uploadImageToDrive(
  file: File,
  folderId: string,
  fileName: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const stream = Readable.from(buffer);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: file.type,
      body: stream,
    },
    fields: 'id',
  });

  // جعل الصورة عامة
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // رابط الصورة المباشر
  return `https://drive.google.com/uc?id=${response.data.id}&export=view`;
}

// POST: إضافة منتج جديد مع صور
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const mainImage = formData.get('mainImage') as File;
    const subImages = formData.getAll('subImages') as File[];

    if (!name || !price || !mainImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // إنشاء مجلد باسم المنتج في Drive
    const folderResponse = await drive.files.create({
      requestBody: {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      fields: 'id',
    });
    
    const productFolderId = folderResponse.data.id;

    // رفع الصورة الرئيسية
    const mainImageUrl = await uploadImageToDrive(mainImage, productFolderId!, 'main.jpg');

    // رفع الصور الفرعية
    const subImagesUrls: string[] = [];
    for (let i = 0; i < subImages.length; i++) {
      const url = await uploadImageToDrive(subImages[i], productFolderId!, `sub${i + 1}.jpg`);
      subImagesUrls.push(url);
    }

    // قراءة المنتجات الحالية
    const products = getProducts();
    
    // تحديد ID جديد
    const newId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
    
    // المنتج الجديد
    const newProduct = {
      id: newId,
      name,
      price,
      category,
      description,
      mainImage: mainImageUrl,
      subImages: subImagesUrls,
      inStock: true,
      createdAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    saveProducts(products);
    
    // إضافة المنتج إلى Google Sheets
    await addToSheets(newProduct);
    
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// إضافة المنتج إلى Google Sheets
async function addToSheets(product: any) {
  try {
    const sheetsAuth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth: sheetsAuth });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          product.id,
          product.name,
          product.price,
          product.category,
          product.description,
          product.mainImage,
          product.subImages.join(','),
        ]],
      },
    });
  } catch (error) {
    console.error('Error adding to Sheets:', error);
  }
}

// GET: جلب المنتجات
export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}