document.addEventListener("DOMContentLoaded", function () {
    updateCartUI();

    // إضافة المنتجات إلى السلة عند النقر على زر "أضف إلى السلة"
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            let productName = this.parentElement.querySelector("h3").textContent.trim();
            addToCart(productName);
        });
    });

    // التحقق من الحقول وتخزين البيانات تلقائيًا عند كل تغيير
    document.getElementById("name")?.addEventListener("input", savePersonalInfo);
    document.getElementById("address")?.addEventListener("input", savePersonalInfo);
    document.getElementById("phone")?.addEventListener("input", savePersonalInfo);

    // حذف البيانات من localStorage عند مسح الحقل
    document.getElementById("name")?.addEventListener("input", clearPersonalInfo);
    document.getElementById("address")?.addEventListener("input", clearPersonalInfo);
    document.getElementById("phone")?.addEventListener("input", clearPersonalInfo);

    // تعبئة الحقول بالمعلومات الشخصية إذا كانت موجودة
    fillPersonalInfo();
});

// قائمة الأسعار
const productPrices = {
    "مبخرة بديع صفراء": 29,
    "مبخرة بديع زرقاء": 29,
    "مبخرة الوردة": 19,
    "مبخرة النخلة": 19,
    "بلاطو مرايا": 39,
    "قرعة البخور": 19,
    "ملقط البخور": 8,
    "بخور": 25,
    "باك الفخامة": 109,
    "باك الأناقة": 99
};

// إضافة منتج إلى السلة
function addToCart(productName) {
    if (!productPrices[productName]) {
        console.error("❌ لم يتم العثور على السعر لهذا المنتج:", productName);
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(productName);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

// تحديث واجهة السلة
function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let totalPriceElement = document.getElementById("cart-total");
    let checkoutButton = document.getElementById("checkout-button");
    let emptyMessage = document.getElementById("cart-empty");
    let clearCartButton = document.getElementById("clear-cart");
    let closeCartButton = document.getElementById("close-cart");
    addEventListener("click", toggleCart);

    if (!cartItemsContainer || !totalPriceElement) return;

    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
        emptyMessage.style.display = "block";
        checkoutButton.style.display = "none";
        clearCartButton.style.display = "none";  // إخفاء زر تفريغ السلة عندما السلة فارغة
    } else {
        emptyMessage.style.display = "none";
        checkoutButton.style.display = "block";
        clearCartButton.style.display = "block";  // إظهار زر تفريغ السلة عندما السلة تحتوي على عناصر
    }

    cart.forEach((product, index) => {
        if (!productPrices[product]) {
            console.warn("⚠️ المنتج غير معروف في القائمة:", product);
            return;
        }

        let listItem = document.createElement("li");
        listItem.textContent = product + " - " + productPrices[product] + " درهم";
        totalPrice += productPrices[product];

        // زر إزالة المنتج
        let removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("remove-item");
        removeBtn.onclick = function () {
            removeFromCart(index);
        };

        listItem.appendChild(removeBtn);
        cartItemsContainer.appendChild(listItem);
    });

    totalPriceElement.textContent = "المجموع: " + totalPrice + " درهم";
}

// إزالة منتج معين من السلة
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

// تفريغ السلة بالكامل
function clearCart() {
    localStorage.removeItem("cart");
    updateCartUI();
}

// إتمام الشراء
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let personalInfo = getPersonalInfo();
    
    if (cart.length === 0) {
        alert("السلة فارغة، أضف منتجات أولاً!");
        return;
    }

    if (!personalInfo.name || !personalInfo.address || !personalInfo.phone) {
        alert("الرجاء إدخال جميع المعلومات الشخصية.");
        return;
    }

    alert(`✅ تم إتمام طلبك بنجاح! \nالإسم: ${personalInfo.name} \nالعنوان: ${personalInfo.address} \nرقم الهاتف: ${personalInfo.phone}`);
    
    // مسح الحقول الشخصية
    document.getElementById("name").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phone").value = "";

    // مسح بيانات المستخدم من localStorage
    localStorage.removeItem("personalInfo");
}

// حفظ المعلومات الشخصية في localStorage
function savePersonalInfo() {
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phone").value;

    // التأكد من أن جميع الحقول قد تم ملؤها
    if (name && address && phone) {
        let personalInfo = { name, address, phone };
        localStorage.setItem("personalInfo", JSON.stringify(personalInfo));
    }
}

// استرجاع المعلومات الشخصية من localStorage
function getPersonalInfo() {
    return JSON.parse(localStorage.getItem("personalInfo")) || {};
}

// تعبئة الحقول بالمعلومات الشخصية إذا كانت موجودة
function fillPersonalInfo() {
    let personalInfo = getPersonalInfo();

    if (personalInfo.name) document.getElementById("name").value = personalInfo.name;
    if (personalInfo.address) document.getElementById("address").value = personalInfo.address;
    if (personalInfo.phone) document.getElementById("phone").value = personalInfo.phone;
}

// حذف البيانات من localStorage عند مسح الحقل
function clearPersonalInfo(event) {
    let fieldId = event.target.id;

    if (event.target.value === "") {
        let personalInfo = JSON.parse(localStorage.getItem("personalInfo")) || {};
        delete personalInfo[fieldId]; // حذف الحقل الذي تم مسحه
        localStorage.setItem("personalInfo", JSON.stringify(personalInfo));
    }
}

// فتح/إغلاق السلة
function toggleCart() {
    let cartSection = document.getElementById("cart");
    if (cartSection) {
        cartSection.style.display = (cartSection.style.display === "none" || cartSection.style.display === "") ? "block" : "none";
    }
    window.location.href = "index.html";
}