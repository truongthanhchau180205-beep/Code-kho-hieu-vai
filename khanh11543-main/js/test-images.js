// Test script để thay đổi hình ảnh sản phẩm
// Chạy sau khi trang web đã tải xong

// Chờ 2 giây rồi thay đổi hình ảnh
setTimeout(() => {
    console.log('🚀 Bắt đầu thay đổi hình ảnh...');
    
    // Thay đổi Samsung Galaxy S23
    changeProductImage("Samsung Galaxy S23", "https://cdn.tgdd.vn/Products/Images/42/319897/samsung-galaxy-s23-600x600.jpg");
    
    // Thay đổi AirPods Pro 2
    changeProductImage("AirPods Pro 2", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409_FMT_WHH?wid=752&hei=636&fmt=jpeg&qlt=80&.v=1724041668836");
    
    // Thay đổi Xiaomi 13 Pro
    changeProductImage("Xiaomi 13 Pro", "https://cdn.tgdd.vn/Products/Images/42/303825/xiaomi-13-pro-xanh-thumb-600x600.jpg");
    
    console.log('✅ Hoàn thành thay đổi hình ảnh!');
}, 2000);

// Function để thay đổi nhiều hình ảnh cùng lúc
function updateAllImages() {
    const imageUpdates = {
        "Samsung Galaxy S23": "https://cdn.tgdd.vn/Products/Images/42/319897/samsung-galaxy-s23-600x600.jpg",
        "AirPods Pro 2": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409_FMT_WHH?wid=752&hei=636&fmt=jpeg&qlt=80&.v=1724041668836",
        "Xiaomi 13 Pro": "https://cdn.tgdd.vn/Products/Images/42/303825/xiaomi-13-pro-xanh-thumb-600x600.jpg",
        "Google Pixel 8 Pro": "https://cdn.tgdd.vn/Products/Images/42/307174/google-pixel-8-pro-xanh-duong-thumb-600x600.jpg"
    };
    
    Object.entries(imageUpdates).forEach(([productName, imageUrl]) => {
        changeProductImage(productName, imageUrl);
    });
}

// Thêm button để test
document.addEventListener('DOMContentLoaded', function() {
    const testButton = document.createElement('button');
    testButton.innerHTML = '🔄 Test Change Images';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        padding: 10px 15px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    `;
    testButton.onclick = updateAllImages;
    document.body.appendChild(testButton);
});
