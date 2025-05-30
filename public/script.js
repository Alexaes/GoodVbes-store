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
        
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "flex-start";
        li.style.marginBottom = "10px";
        
        const textSpan = document.createElement("span");
        textSpan.style.display = "flex";
        textSpan.style.flexDirection = "column";
        
        const productText = document.createElement("span");
        productText.textContent = `${product}`;
        productText.style.fontWeight = "600";
        
        const quantityText = document.createElement("span");
        quantityText.textContent = `Quantity: ${quantity}`;
        quantityText.style.fontSize = "0.9em";
        quantityText.style.color = "#555";
        
        textSpan.appendChild(productText);
        textSpan.appendChild(quantityText);
        
        const priceAndDeleteContainer = document.createElement("div");
        priceAndDeleteContainer.style.display = "flex";
        priceAndDeleteContainer.style.flexDirection = "column";
        priceAndDeleteContainer.style.alignItems = "center";
        priceAndDeleteContainer.style.gap = "4px";
        priceAndDeleteContainer.style.marginLeft = "12px";
        
        const priceOnlyText = document.createElement("span");
        priceOnlyText.textContent = `${price} MAD`;
        priceOnlyText.style.color = "black";
        priceOnlyText.style.fontWeight = "bold";
        priceOnlyText.style.fontSize = "0.95em";
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        deleteBtn.style.width = "37px";
        deleteBtn.style.border = "none";
        deleteBtn.style.backgroundColor = "#ffffff00";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.onclick = () => { removeProductFromCart(product); };
        
        priceAndDeleteContainer.appendChild(priceOnlyText);
        priceAndDeleteContainer.appendChild(deleteBtn);
        
        li.appendChild(textSpan);
        li.appendChild(priceAndDeleteContainer);
        
        cartItemsList.appendChild(li);
      }
    }
    if (totalPriceElem) totalPriceElem.textContent = totalPrice;
  }
}

  function showNotification(message, type) {
    const notif = document.createElement("div");
    notif.textContent = message;
    notif.className = `notification ${type}`;
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.remove();
    }, 3000);
  }

  function clearCart() {
    localStorage.removeItem("cart");
  }

  document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();

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
    const payment = document.querySelector('input[name="payment"]:checked')?.value || "";

    if (name === "" || address === "" || phone === "") {
      showNotification("يرجى ملء البيانات الشخصية بشكل صحيح", "error");
      return;
    }

    const orderDetails = {
      name,
      address,
      phone,
      paymentMethod: payment,
      order: JSON.parse(localStorage.getItem('cart')) || []
    };

    console.log("تفاصيل الطلب:", orderDetails);

    showNotification(`شكراً ${name}، تم إتمام الشراء بنجاح!`, "success");
    clearCart();

    nameInput.value = "";
    addressInput.value = "";
    phoneInput.value = "";
  });

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
    document.getElementById('search-input').value = '';
    resetSearch();
    toggleSearchBar();
  }
}

function resetSearch() {
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
    resetSearch();
    showNotification("تم إظهار جميع المنتجات", "success");
    return;
  }

  let productList = document.querySelectorAll(".product");
  if (!productList.length) {
    console.error(" لم يتم العثور على المنتجات!");
    return;
  }

  let found = false;

  productList.forEach(product => {
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

function addClearSearchButton() {
  const searchContainer = document.querySelector('.search-container');
  const clearButton = document.createElement('button');
  clearButton.id = 'clear-search-btn';
  clearButton.innerHTML = '<i class="fas fa-times"></i>';
  clearButton.addEventListener('click', function() {
    document.getElementById('search-input').value = '';
    resetSearch();
  });
  
  searchContainer.insertBefore(clearButton, document.getElementById('search-btn'));
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('fade-in');
  updateCartCount();
  if (document.getElementById("cart-items")) {
    displayCart();
  }
  
  addClearSearchButton();
});

function openCart() {
  document.getElementById("cartPanel").classList.add("open");
  displayCart();
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
}