// تعريف خريطة أسعار المنتجات
const productCatalog = {
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

// تحديث عداد المنتجات على أيقونة السلة
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElem = document.getElementById("cart-item-count");
  if (cartCountElem) {
    cartCountElem.textContent = cart.length;
  }
}

// تعديل كمية منتج معين في السلة
function modifyCartItem(productName, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (delta > 0) {
    for (let i = 0; i < delta; i++) {
      cart.push(productName);
    }
  } else if (delta < 0) {
    for (let i = 0; i < Math.abs(delta); i++) {
      let index = cart.indexOf(productName);
      if (index > -1) {
        cart.splice(index, 1);
      }
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

// إزالة منتج بالكامل من السلة عند النقر على العلامة
function removeProductFromCart(productName) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.trim() !== productName.trim());
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
  showNotification(`تم إزالة ${productName} من السلة`, "success");
}

// عرض محتويات السلة مع حساب الكميات والمجموع وإضافة أزرار التعديل
function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsList = document.getElementById("cart-items");
  const cartEmptyMessage = document.getElementById("cart-empty");
  const totalPriceElem = document.getElementById("total-price");
  const checkoutButton = document.getElementById("checkout-button");
  const clearCartButton = document.getElementById("clear-cart");

  if (cartItemsList) {
    cartItemsList.innerHTML = "";
    let totalPrice = 0;
    if (cart.length === 0) {
      if (cartEmptyMessage) cartEmptyMessage.style.display = "block";
      if (checkoutButton) checkoutButton.style.display = "none";
      if (clearCartButton) clearCartButton.style.display = "none";
    } else {
      if (cartEmptyMessage) cartEmptyMessage.style.display = "none";
      if (checkoutButton) checkoutButton.style.display = "inline-block";
      if (clearCartButton) clearCartButton.style.display = "inline-block";

      let productCounts = {};
      cart.forEach(item => {
        item = item.trim();
        productCounts[item] = (productCounts[item] || 0) + 1;
      });

      for (let product in productCounts) {
        const li = document.createElement("li");
        const quantity = productCounts[product];
        const price = productCatalog[product] || 0;
        const itemTotal = price * quantity;
        totalPrice += itemTotal;

        const textSpan = document.createElement("span");
        textSpan.textContent = `${product} × ${quantity} ${itemTotal} درهم`;
        li.appendChild(textSpan);

        const addBtn = document.createElement("button");
        addBtn.textContent = "+";
        addBtn.onclick = () => { modifyCartItem(product, 1); };
        li.appendChild(addBtn);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "-";
        removeBtn.onclick = () => { modifyCartItem(product, -1); };
        li.appendChild(removeBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = () => { removeProductFromCart(product); };
        li.appendChild(deleteBtn);

        cartItemsList.appendChild(li);
      }
    }
    if (totalPriceElem) totalPriceElem.textContent = totalPrice;
  }
}

// إتمام عملية الشراء (محاكاة) مع تفريغ حقول البيانات
function checkout() {
  const nameInput = document.getElementById("name");
  const addressInput = document.getElementById("address");
  const phoneInput = document.getElementById("phone");

  if (!nameInput || !addressInput || !phoneInput) {
    showNotification("يرجى ملء البيانات الشخصية", "error");
    return;
  }

  const name = nameInput.value.trim();
  const address = addressInput.value.trim();
  const phone = phoneInput.value.trim();

  if (name === "" || address === "" || phone === "") {
    showNotification("يرجى ملء البيانات الشخصية بشكل صحيح", "error");
    return;
  }

  // تنفيذ عملية الشراء
  showNotification(`شكراً ${name}، تم إتمام الشراء بنجاح!`, "success");
  clearCart();

  // تفريغ حقول البيانات بعد إتمام الطلب
  nameInput.value = "";
  addressInput.value = "";
  phoneInput.value = "";
}

// تفريغ السلة بالكامل مع إشعار عند المسح
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  displayCart();
  showNotification("تم مسح السلة بنجاح", "clear-cart-notification");
}

function addToCart(productName) {
  productName = productName.trim();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(productName);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "1";
  }, 100);

  setTimeout(() => {
    notification.style.opacity = "0";

    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('fade-in');
  updateCartCount();
  if (document.getElementById("cart-items")) {
    displayCart();
  }
});

// وظائف البحث

function toggleSearchBar() {
  const searchContainer = document.querySelector('.search-container');
  searchContainer.classList.toggle('active');
  
  // When opening the search bar, focus on the input
  if (searchContainer.classList.contains('active')) {
    document.getElementById('search-input').focus();
  } else {
    // When closing the search bar, clear the search and reset products
    document.getElementById('search-input').value = '';
    resetSearch();
  }
}

function searchProducts(event) {
  if (event.key === 'Enter') {
    performSearch();
  } else if (event.key === 'Escape') {
    // Reset search when pressing Escape key
    document.getElementById('search-input').value = '';
    resetSearch();
    toggleSearchBar(); // Close the search bar
  }
}

function resetSearch() {
  // Show all products again
  let productList = document.querySelectorAll(".product");
  productList.forEach(product => {
    product.style.display = "block";
  });
}

function performSearch() {
  let searchInput = document.getElementById("search-input");
  if (!searchInput) {
    console.error(" لم يتم العثور على مربع البحث!");
    return;
  }

  let query = searchInput.value.trim().toLowerCase();
  if (query === "") {
    // If the search input is empty, show all products
    resetSearch();
    showNotification("تم إظهار جميع المنتجات", "success");
    return;
  }

  // استخدام الكلاس الصحيح "product" بدلاً من "product-item"
  let productList = document.querySelectorAll(".product");
  if (!productList.length) {
    console.error(" لم يتم العثور على المنتجات!");
    return;
  }

  let found = false;

  productList.forEach(product => {
    // استخدام العنصر h3 داخل كل منتج
    let productNameElem = product.querySelector("h3");
    if (!productNameElem) return;

    let productName = productNameElem.textContent.trim().toLowerCase();
    product.style.display = productName.includes(query) ? "block" : "none";

    if (productName.includes(query)) found = true;
  });

  if (!found) {
    showNotification("! لم يتم العثور على المنتج المطلوب", "error");
  } else {
    showNotification("تم العثور على نتائج البحث", "success");
  }
}

// Add a clear button to the search bar
function addClearSearchButton() {
  const searchContainer = document.querySelector('.search-container');
  const clearButton = document.createElement('button');
  clearButton.id = 'clear-search-btn';
  clearButton.innerHTML = '<i class="fas fa-times"></i>';
  clearButton.addEventListener('click', function() {
    document.getElementById('search-input').value = '';
    resetSearch();
  });
  
  // Add it after the search input but before the search button
  searchContainer.insertBefore(clearButton, document.getElementById('search-btn'));
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('fade-in');
  updateCartCount();
  if (document.getElementById("cart-items")) {
    displayCart();
  }
  
  // Add clear search button
  addClearSearchButton();
});