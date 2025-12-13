/* =====================================================
   NAVBAR SCROLL EFFECT
===================================================== */
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
});

/* =====================================================
   CART SIDEBAR OPEN / CLOSE
===================================================== */
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartIcon = document.querySelector(".cart-icon");
const closeCartBtn = document.getElementById("closeCart");

function openSidebar() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("show");
}

function closeSidebar() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");
}

if (cartIcon) cartIcon.addEventListener("click", openSidebar);
if (closeCartBtn) closeCartBtn.addEventListener("click", closeSidebar);
if (cartOverlay) cartOverlay.addEventListener("click", closeSidebar);

/* =====================================================
   CART STATE (PERSISTENT)
===================================================== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-count");

/* =====================================================
   HELPER: NORMALIZE IMAGE PATH
===================================================== */
function normalizeImagePath(img) {
    if (!img) return "";
    img = img.replace(/^(\.\.\/|\.\/)/, "");
    if (location.pathname.includes("/pages/")) {
        return "../" + img;
    }
    return img;
}

/* =====================================================
   UPDATE CART UI + SAVE
===================================================== */
function updateCart() {
    if (!cartItemsContainer || !cartTotal || !cartCount) return;

    cartItemsContainer.innerHTML = "";

    let totalItems = 0;

    cart.forEach((item, index) => {
        totalItems += item.qty;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${normalizeImagePath(item.img)}" alt="">
                <div class="cart-item-info">
                    <p class="mb-1"><strong>${item.title}</strong></p>

                    <div class="qty-controls">
                        <button class="qty-btn minus" data-index="${index}">−</button>
                        <span class="qty">${item.qty}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>

                    <span class="remove-item" data-index="${index}">Remove</span>
                </div>
            </div>
        `;
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = `₦ ${totalItems * 10000}`; // placeholder pricing

    localStorage.setItem("cart", JSON.stringify(cart));
}

/* =====================================================
   CART ACTIONS (REMOVE / PLUS / MINUS)
===================================================== */
document.addEventListener("click", (e) => {

    // remove item
    if (e.target.classList.contains("remove-item")) {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        updateCart();
    }

    // increase qty
    if (e.target.classList.contains("plus")) {
        const index = e.target.dataset.index;
        cart[index].qty++;
        updateCart();
    }

    // decrease qty
    if (e.target.classList.contains("minus")) {
        const index = e.target.dataset.index;
        cart[index].qty--;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        updateCart();
    }
});

/* =====================================================
   ADD TO CART (NO DUPLICATES)
===================================================== */
document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        const productCard = this.closest(".product-card");
        if (!productCard) return;

        const title =
            productCard.querySelector(".product-title")?.textContent || "Product";

        const bg =
            productCard.querySelector(".product-image")?.style.backgroundImage || "";

        let img = bg
            .replace(/^url\(["']?/, "")
            .replace(/["']?\)$/, "");

        img = normalizeImagePath(img);

        // check if item already exists
        const existingItem = cart.find(item => item.title === title);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                title,
                img,
                qty: 1
            });
        }

        updateCart();

        // visual feedback
        this.innerHTML = '<i class="fas fa-check me-2"></i>Added';
        this.classList.add("opacity-75");

        setTimeout(() => {
            this.innerHTML = "Add";
            this.classList.remove("opacity-75");
        }, 1200);
    });
});

/* =====================================================
   ORDER NOW → WHATSAPP + CLEAR CART
===================================================== */
const orderBtn = document.querySelector(".btn-order-now");

if (orderBtn) {
    orderBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        let message = "Hello Divine Endowments, I want to place an order:%0A%0A";

        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.title} (Qty: ${item.qty})%0A`;
        });

        message += "%0AThank you.";

        const phone = "2348147006000";
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

        // clear cart
        cart = [];
        localStorage.removeItem("cart");
        updateCart();
        closeSidebar();
    });
}

/* =====================================================
   INITIAL LOAD
===================================================== */
updateCart();
