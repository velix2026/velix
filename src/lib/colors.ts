// أشهر ألوان الملابس للمنتجات
export const clothingColors = [
  { code: "#000000", name: "أسود", nameEn: "Black", category: "neutral" },
  { code: "#FFFFFF", name: "أبيض", nameEn: "White", category: "neutral" },
  { code: "#808080", name: "رمادي", nameEn: "Gray", category: "neutral" },
  { code: "#C0C0C0", name: "فضي", nameEn: "Silver", category: "metallic" },
  { code: "#B76E79", name: "نحاسي وردي", nameEn: "Rose Gold", category: "metallic" },
  { code: "#B87333", name: "نحاسي", nameEn: "Copper", category: "metallic" },
  { code: "#CD7F32", name: "برونزي", nameEn: "Bronze", category: "metallic" },
  { code: "#FFD700", name: "ذهبي", nameEn: "Gold", category: "metallic" },
  { code: "#FF0000", name: "أحمر", nameEn: "Red", category: "vibrant" },
  { code: "#DC143C", name: "قرمزي", nameEn: "Crimson", category: "vibrant" },
  { code: "#8B0000", name: "أحمر غامق", nameEn: "Dark Red", category: "dark" },
  { code: "#0000FF", name: "أزرق", nameEn: "Blue", category: "vibrant" },
  { code: "#1E3A8A", name: "أزرق غامق", nameEn: "Navy", category: "dark" },
  { code: "#4169E1", name: "أزرق ملكي", nameEn: "Royal Blue", category: "vibrant" },
  { code: "#87CEEB", name: "أزرق سماوي", nameEn: "Sky Blue", category: "light" },
  { code: "#008000", name: "أخضر", nameEn: "Green", category: "vibrant" },
  { code: "#228B22", name: "أخضر غامق", nameEn: "Forest Green", category: "dark" },
  { code: "#90EE90", name: "أخضر فاتح", nameEn: "Light Green", category: "light" },
  { code: "#FFFF00", name: "أصفر", nameEn: "Yellow", category: "vibrant" },
  { code: "#FFA500", name: "برتقالي", nameEn: "Orange", category: "vibrant" },
  { code: "#FF8C00", name: "برتقالي غامق", nameEn: "Dark Orange", category: "vibrant" },
  { code: "#800080", name: "بنفسجي", nameEn: "Purple", category: "vibrant" },
  { code: "#9370DB", name: "متوسط", nameEn: "Medium Purple", category: "light" },
  { code: "#FFC0CB", name: "وردي", nameEn: "Pink", category: "light" },
  { code: "#FF69B4", name: "وردي ساخن", nameEn: "Hot Pink", category: "vibrant" },
  { code: "#A52A2A", name: "بني", nameEn: "Brown", category: "neutral" },
  { code: "#8B4513", name: "بني غامق", nameEn: "Saddle Brown", category: "neutral" },
  { code: "#D2691E", name: "بني محمر", nameEn: "Chocolate", category: "neutral" },
  { code: "#F5F5DC", name: "بيج", nameEn: "Beige", category: "neutral" },
  { code: "#FFF8DC", name: "كورن فلوور", nameEn: "Cornsilk", category: "light" },
  { code: "#FAEBD7", name: "عاجي", nameEn: "Antique White", category: "light" },
  { code: "#2F4F4F", name: "سليري غامق", nameEn: "Dark Slate Gray", category: "dark" },
  { code: "#556B2F", name: "زيتوني غامق", nameEn: "Dark Olive Green", category: "dark" },
  { code: "#6B8E23", name: "زيتوني", nameEn: "Olive Drab", category: "neutral" },
  { code: "#BDB76B", name: "كاكي", nameEn: "Dark Khaki", category: "neutral" },
  { code: "#E6E6FA", name: "لافندر", nameEn: "Lavender", category: "light" },
  { code: "#DDA0DD", name: "برقوقي", nameEn: "Plum", category: "light" },
];

// دالة لجلب اللون من الكود
export const getColorByCode = (code: string) => {
  return clothingColors.find(c => c.code === code) || { code, name: code, nameEn: code, category: "custom" };
};

// دالة لجلب ألوان حسب التصنيف
export const getColorsByCategory = (category: string) => {
  return clothingColors.filter(c => c.category === category);
};

// الألوان المعدنية المميزة لبراند VELIX
export const metallicColors = [
  { code: "#B76E79", name: "نحاسي وردي", nameEn: "Rose Gold" },
  { code: "#B87333", name: "نحاسي", nameEn: "Copper" },
  { code: "#CD7F32", name: "برونزي", nameEn: "Bronze" },
  { code: "#FFD700", name: "ذهبي", nameEn: "Gold" },
  { code: "#C0C0C0", name: "فضي", nameEn: "Silver" },
];

// الألوان الأساسية المحايدة
export const neutralColors = clothingColors.filter(c => c.category === "neutral");

// الألوان الداكنة
export const darkColors = clothingColors.filter(c => c.category === "dark");

// الألوان الفاتحة
export const lightColors = clothingColors.filter(c => c.category === "light");

// الألوان الزاهية
export const vibrantColors = clothingColors.filter(c => c.category === "vibrant");