// تحديث زر إكمال الطلب
function updateCheckoutButton() {
    let checkoutBtn = document.getElementById("checkout-btn");
    let cartItems = document.getElementById("cart-items");
    
    if (cartItems.children.length > 0) {
        checkoutBtn.style.display = "block"; // إظهار الزر إذا كانت السلة غير فارغة
        checkoutBtn.onclick = checkout; // إضافة حدث النقر على زر إكمال الطلب
    } else {
        checkoutBtn.style.display = "none"; // إخفاء الزر إذا كانت السلة فارغة
        checkoutBtn.onclick = null; // إزالة حدث النقر إذا كانت السلة فارغة
    }
}

// إضافة منتج إلى السلة
function addToCart(productName) {
    let cartItems = document.getElementById("cart-items");
    let listItem = document.createElement("li");
    listItem.textContent = productName;

    // إضافة زر لإزالة المنتج من السلة
    let removeBtn = document.createElement("button");
    removeBtn.textContent = "إزالة";
    removeBtn.classList.add("remove-item");
    removeBtn.onclick = function() {
        removeFromCart(listItem); // إزالة العنصر عند الضغط على زر إزالة
    };
    
    listItem.appendChild(removeBtn);
    cartItems.appendChild(listItem);
    
    updateCheckoutButton(); // تحديث زر إكمال الطلب
}

// إزالة منتج من السلة
function removeFromCart(listItem) {
    let cartItems = document.getElementById("cart-items");
    cartItems.removeChild(listItem); // إزالة العنصر من السلة
    
    updateCheckoutButton(); // تحديث حالة زر إكمال الطلب
}

// إكمال الطلب
function checkout() {
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phone").value;
    
    // التحقق من أن جميع الخانات تم ملؤها
    if (name === "" || address === "" || phone === "") {
        alert("يرجى ملء جميع الخانات قبل إكمال الطلب!");
        return;
    }

    // إظهار رسالة تأكيد
    alert("تم إرسال طلبك بنجاح!");
    
    // مسح البيانات
    document.getElementById("cart-items").innerHTML = "";
    document.getElementById("name").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phone").value = "";
    
    updateCheckoutButton(); // تحديث حالة زر إكمال الطلب
}

// تغيير عرض السلة
function togglecart() {
    const cartTable = document.getElementById("cart-table");
    cartTable.classList.toggle("active");
}

// الكود للتفاعل مع الـ API (اختياري - إذا كنت تستخدم خدمة من السيرفر أو قاعدة بيانات)
exports.handler = async function(event, context) {
    const { product_id, quantity } = JSON.parse(event.body); // استلام البيانات من العميل

    console.log(`تم إضافة منتج: ID ${product_id} - الكمية: ${quantity}`);

    // هنا يمكنك إضافة الكود لتخزين البيانات في قاعدة بيانات أو إرسالها عبر البريد الإلكتروني

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'تم إضافة العنصر إلى السلة!' })
    };
};