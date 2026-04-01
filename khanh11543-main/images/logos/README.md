# Hướng dẫn sử dụng Logo Ngân hàng

## Cách thêm logo ảnh cho ngân hàng:

### 1. Chuẩn bị file ảnh logo:
- **Định dạng**: PNG, JPG, SVG (khuyến nghị PNG với nền trong suốt)
- **Kích thước**: 120x90px hoặc tỷ lệ 4:3
- **Chất lượng**: High resolution để hiển thị sắc nét

### 2. Đặt file ảnh vào thư mục:
```
images/logos/
├── techcombank-logo.png
├── vietcombank-logo.png
├── bidv-logo.png
└── (thêm logo ngân hàng khác...)
```

### 3. Cập nhật HTML:

#### Để sử dụng logo ảnh cho Techcombank:
```html
<!-- Thay đổi từ: -->
<div class="bank-logo text-logo">
    <!-- <img src="images/logos/techcombank-logo.png" alt="Techcombank"> -->
    TCB
</div>

<!-- Thành: -->
<div class="bank-logo image-logo">
    <img src="images/logos/techcombank-logo.png" alt="Techcombank">
</div>
```

#### Để sử dụng logo ảnh cho Vietcombank:
```html
<!-- Thay đổi từ: -->
<div class="bank-logo text-logo">
    <!-- <img src="images/logos/vietcombank-logo.png" alt="Vietcombank"> -->
    VCB
</div>

<!-- Thành: -->
<div class="bank-logo image-logo">
    <img src="images/logos/vietcombank-logo.png" alt="Vietcombank">
</div>
```

#### Để sử dụng logo ảnh cho BIDV:
```html
<!-- Thay đổi từ: -->
<div class="bank-logo text-logo">
    <!-- <img src="images/logos/bidv-logo.png" alt="BIDV"> -->
    BIDV
</div>

<!-- Thành: -->
<div class="bank-logo image-logo">
    <img src="images/logos/bidv-logo.png" alt="BIDV">
</div>
```

### 4. Thêm ngân hàng mới:

Để thêm ngân hàng mới, copy và chỉnh sửa một trong các bank-option:

```html
<div class="bank-option" data-bank="sacombank">
    <div class="bank-info">
        <div class="bank-logo image-logo">
            <img src="images/logos/sacombank-logo.png" alt="Sacombank">
        </div>
        <div class="bank-details">
            <h4>Sacombank</h4>
            <p>Ngân hàng TMCP Sài Gòn Thương Tín</p>
        </div>
    </div>
    <div class="bank-check">
        <i class="fas fa-check"></i>
    </div>
</div>
```

Và thêm thông tin ngân hàng vào JavaScript:
```javascript
const banks = {
    // ... existing banks
    sacombank: {
        name: 'Sacombank',
        code: '970403',
        account: '0123456789',
        owner: 'CONG TY TNHH TECHSTORE'
    }
};
```

### 5. Tối ưu hóa logo:

#### Để logo hiển thị đẹp nhất:
- **Kích thước container**: 60x45px (desktop), 50x38px (mobile)
- **Padding**: 2px xung quanh ảnh
- **Background**: Trắng cho logo ảnh
- **Border**: Màu brand của ngân hàng

#### CSS tự động xử lý:
- Responsive design (tự động thu nhỏ trên mobile)
- Hover effects (phóng to và shadow)
- Active states (highlight khi được chọn)
- Fallback text nếu ảnh không load được

### 6. Lưu ý quan trọng:

- **Copyright**: Đảm bảo bạn có quyền sử dụng logo ngân hàng
- **Official logos**: Sử dụng logo chính thức từ website ngân hàng
- **File size**: Tối ưu kích thước file để tải nhanh
- **Alt text**: Luôn thêm alt text cho accessibility

### 7. Fallback strategy:

Nếu logo ảnh không load được, hệ thống sẽ tự động:
- Hiển thị text logo (TCB, VCB, BIDV)
- Giữ nguyên styling và colors
- Vẫn hoạt động bình thường

Chúc bạn thành công!
