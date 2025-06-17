(() => {
        // Data produk contoh
        const products = [
          {
            id: "p1",
            name: "Kue Balok Cokelat Spesial",
            price: 25000,
            rating: 4.7,
            image:
              "https://placehold.co/300x300/6b4c36/fff?text=Kue+Balok+Cokelat",
            description:
              "Lezatnya kue balok dengan cokelat asli yang menggoda selera.",
            flavor: "cokelat",
          },
          {
            id: "p2",
            name: "Kue Balok Keju Lumer",
            price: 28000,
            rating: 4.5,
            image:
              "https://placehold.co/300x300/d4b483/3a2f1c?text=Kue+Balok+Keju",
            description:
              "Kue balok dengan keju lumer segar di setiap gigitannya.",
            flavor: "keju",
          },
          {
            id: "p3",
            name: "Kue Balok Original",
            price: 22000,
            rating: 4.3,
            image:
              "https://placehold.co/300x300/f9d9ad/5c4827?text=Kue+Balok+Original",
            description: "Rasa original kue balok yang tradisional dan nikmat.",
            flavor: "original",
          },
          {
            id: "p4",
            name: "Kue Balok Matcha Jepang",
            price: 30000,
            rating: 4.8,
            image:
              "https://placehold.co/300x300/6e886f/fff?text=Kue+Balok+Matcha",
            description:
              "Perpaduan unik kue balok dengan matcha Jepang pilihan.",
            flavor: "matcha",
          },
          {
            id: "p5",
            name: "Kue Balok Taro Manis",
            price: 27000,
            rating: 4.6,
            image:
              "https://placehold.co/300x300/ae8cb9/fff?text=Kue+Balok+Taro",
            description:
              "Manis lembut kue balok rasa taro yang disukai semua usia.",
            flavor: "taro",
          },
        ];

        // State Keranjang
        let cart = JSON.parse(localStorage.getItem("kulokCart") || "{}");

        // State User Login (mock)
        let currentUser = localStorage.getItem("kulokUser") || null;

        // Elemen DOM utama
        const navButtons = document.querySelectorAll(
          "header nav button.nav-btn"
        );
        const bottomNavButtons = document.querySelectorAll(
          ".bottom-nav button.bottom-nav-btn"
        );
        const sections = document.querySelectorAll("main section.section");
        const homeProductGrid = document.getElementById("home-product-grid");
        const productsProductGrid = document.getElementById(
          "products-product-grid"
        );
        const filterSortSelect = document.getElementById("sort-select");
        const filterFlavorSelect = document.getElementById("filter-flavor");
        const productsSearchInput = document.getElementById("products-search");
        const productsSearchBtn = document.getElementById(
          "products-search-btn"
        );
        const searchInput = document.getElementById("search-input");

        // Modal & popup
        const modalProductDetail = document.getElementById(
          "modal-product-detail"
        );
        const modalDetailClose = document.getElementById("modal-detail-close");
        const modalLogin = document.getElementById("modal-login");
        const modalLoginClose = document.getElementById("modal-login-close");
        const loginForm = document.getElementById("login-form");
        const loginErrorMsg = document.getElementById("login-error-msg");
        const btnLogin = document.getElementById("btn-login");
        const accountContent = document.getElementById("account-content");
        const userInfo = document.getElementById("user-info");
        const accountForms = document.getElementById("account-forms");

        const detailImg = document.getElementById("detail-img");
        const detailName = document.getElementById("modal-product-name");
        const detailDesc = document.getElementById("modal-product-desc");
        const detailPrice = document.getElementById("modal-product-price");
        const detailRating = document.getElementById("modal-product-rating");
        const btnAddCart = document.getElementById("btn-add-cart");
        const btnBuyNow = document.getElementById("btn-buy-now");

        const cartBtn = document.getElementById("cart-btn");
        const modalCart = document.getElementById("modal-cart");
        const modalCartClose = document.getElementById("modal-cart-close");
        const cartCount = document.getElementById("cart-count");
        const cartItemsContainer = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const btnCheckout = document.getElementById("btn-checkout");

        const promoPopup = document.getElementById("promo-popup");
        const promoCloseBtn = document.getElementById("promo-close-btn");

        // Banner slide elements
        const bannerSlides = document.querySelectorAll(".banner-slide");
        const bannerDots = document.querySelectorAll(".banner-dot");
        const bannerDesc = document.getElementById("banner-desc");
        let currentBannerIndex = 0;
        let bannerInterval;

        // Flash sale countdown
        const countdownHours = document.getElementById("countdown-hours");
        const countdownMinutes = document.getElementById("countdown-minutes");
        const countdownSeconds = document.getElementById("countdown-seconds");

        // =====================================================
        // Fungsi util
        function formatRupiah(num) {
          return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        function setAriaCurrent(btn) {
          navButtons.forEach((b) => b.setAttribute("aria-current", "false"));
          btn.setAttribute("aria-current", "true");
        }
        // =====================================================
        // Navigasi utama halaman
        function switchSection(sectionId) {
          // Hide all
          sections.forEach((s) => {
            s.hidden = true;
            s.tabIndex = -1;
            s.classList.remove("active");
          });
          // Show target
          const section = document.getElementById("section-" + sectionId);
          if (section) {
            section.hidden = false;
            section.tabIndex = 0;
            section.classList.add("active");
            section.focus();
          }

          // Update nav buttons active state
          navButtons.forEach((btn) => {
            if (btn.dataset.section === sectionId) {
              btn.classList.add("active");
              btn.setAttribute("aria-current", "page");
            } else {
              btn.classList.remove("active");
              btn.removeAttribute("aria-current");
            }
          });
          bottomNavButtons.forEach((btn) => {
            if (btn.dataset.section === sectionId) {
              btn.classList.add("active");
              btn.setAttribute("aria-current", "page");
            } else {
              btn.classList.remove("active");
              btn.removeAttribute("aria-current");
            }
          });
        }

        navButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            switchSection(btn.dataset.section);
          });
        });
        bottomNavButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            switchSection(btn.dataset.section);
          });
        });

        // =====================================================
        // Render grid produk
        function createProductCard(product) {
          const card = document.createElement("article");
          card.className = "product-card";
          card.tabIndex = 0;
          card.setAttribute("role", "button");
          card.setAttribute(
            "aria-label",
            `Lihat detail produk ${product.name}`
          );
          card.dataset.productId = product.id;
          card.innerHTML = `
      <div class="product-img-container" aria-hidden="true">
        <img src="${product.image}" alt="Foto produk kue balok ${
            product.name
          }" loading="lazy" />
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">${formatRupiah(product.price)}</div>
        <div class="product-rating" aria-label="Rating ${
          product.rating
        } dari 5">
          ${"★".repeat(Math.floor(product.rating))}${
            product.rating % 1 >= 0.5 ? "½" : ""
          } (${product.rating.toFixed(1)})
        </div>
      </div>
      `;
          // Event buka detail produk
          card.addEventListener("click", () => openProductDetail(product.id));
          // Keyboard: Enter buka detail
          card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openProductDetail(product.id);
            }
          });
          return card;
        }

        // Render produk di home dan produk page sesuai filter
        function renderProductGrid(container, productList) {
          container.innerHTML = "";
          if (productList.length === 0) {
            const noData = document.createElement("p");
            noData.textContent = "Produk tidak ditemukan.";
            noData.style.textAlign = "center";
            noData.style.color = "#6b5840";
            container.appendChild(noData);
            return;
          }
          productList.forEach((p) => {
            container.appendChild(createProductCard(p));
          });
        }

        // =====================================================
        // Detail produk modal
        let detailCurrentProduct = null;
        function openProductDetail(id) {
          const product = products.find((p) => p.id === id);
          if (!product) return;
          detailCurrentProduct = product;
          detailImg.src = product.image;
          detailImg.alt = `Foto produk ${product.name}`;
          detailName.textContent = product.name;
          detailDesc.textContent = product.description;
          detailPrice.textContent = formatRupiah(product.price);
          detailRating.textContent = `Rating: ${product.rating.toFixed(1)} ★`;
          modalProductDetail.classList.add("show");
          modalProductDetail.focus();
        }
        modalDetailClose.addEventListener("click", () => {
          modalProductDetail.classList.remove("show");
          detailCurrentProduct = null;
        });
        modalProductDetail.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            modalProductDetail.classList.remove("show");
            detailCurrentProduct = null;
          }
        });

        // =====================================================
        // Keranjang

        function saveCart() {
          localStorage.setItem("kulokCart", JSON.stringify(cart));
        }

        function updateCartCount() {
          const count = Object.values(cart).reduce(
            (acc, item) => acc + item.qty,
            0
          );
          cartCount.textContent = count;
          cartCount.setAttribute(
            "aria-label",
            `Keranjang berisi ${count} item`
          );
          if (count === 0) {
            cartCount.style.display = "none";
          } else {
            cartCount.style.display = "flex";
          }
        }

        function renderCart() {
          cartItemsContainer.innerHTML = "";
          if (Object.keys(cart).length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "Keranjang anda masih kosong.";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.color = "#6b5840";
            cartItemsContainer.appendChild(emptyMsg);
            cartTotal.textContent = "Total: Rp 0";
            btnCheckout.disabled = true;
            btnCheckout.style.opacity = "0.6";
            return;
          }
          let totalPrice = 0;
          Object.entries(cart).forEach(([productId, item]) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return;
            const itemTotal = product.price * item.qty;
            totalPrice += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
          <img src="${product.image}" alt="Foto produk ${product.name}" />
          <div class="cart-item-info">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">${formatRupiah(product.price)} x ${
              item.qty
            } = ${formatRupiah(itemTotal)}</div>
            <div class="cart-item-qty" aria-label="Ubah jumlah produk">
              <button class="qty-btn btn-minus" aria-label="Kurangi jumlah produk">-</button>
              <div class="qty-display" aria-live="polite" aria-atomic="true">${
                item.qty
              }</div>
              <button class="qty-btn btn-plus" aria-label="Tambah jumlah produk">+</button>
            </div>
          </div>
        `;

            const btnMinus = cartItem.querySelector(".btn-minus");
            const btnPlus = cartItem.querySelector(".btn-plus");
            btnMinus.addEventListener("click", () => {
              if (cart[productId].qty > 1) {
                cart[productId].qty--;
              } else {
                delete cart[productId];
              }
              saveCart();
              updateCartCount();
              renderCart();
            });
            btnPlus.addEventListener("click", () => {
              cart[productId].qty++;
              saveCart();
              updateCartCount();
              renderCart();
            });

            cartItemsContainer.appendChild(cartItem);
          });
          cartTotal.textContent = "Total: " + formatRupiah(totalPrice);
          btnCheckout.disabled = false;
          btnCheckout.style.opacity = "1";
        }

        // Tambah produk ke keranjang
        function addToCart(product, qty = 1) {
          if (cart[product.id]) {
            cart[product.id].qty += qty;
          } else {
            cart[product.id] = { qty };
          }
          saveCart();
          updateCartCount();
        }

        btnAddCart.addEventListener("click", () => {
          if (!detailCurrentProduct) return;
          addToCart(detailCurrentProduct, 1);
          modalProductDetail.classList.remove("show");
          alert(
            `Produk "${detailCurrentProduct.name}" berhasil ditambahkan ke keranjang.`
          );
        });

        btnBuyNow.addEventListener("click", () => {
          if (!detailCurrentProduct) return;
          addToCart(detailCurrentProduct, 1);
          modalProductDetail.classList.remove("show");
          openCartModal();
        });

        // Floating cart button
        cartBtn.addEventListener("click", () => {
          openCartModal();
        });
        modalCartClose.addEventListener("click", () => {
          closeCartModal();
        });
        modalCart.addEventListener("keydown", (e) => {
          if (e.key === "Escape") closeCartModal();
        });

        function openCartModal() {
          modalCart.classList.add("show");
          modalCart.focus();
          renderCart();
        }
        function closeCartModal() {
          modalCart.classList.remove("show");
        }

        // Checkout (reaksi simulasi)
        btnCheckout.addEventListener("click", () => {
          if (Object.keys(cart).length === 0) return;
          alert("Checkout berhasil! Terima kasih telah berbelanja di KULOK.");
          cart = {};
          saveCart();
          updateCartCount();
          renderCart();
          closeCartModal();
        });

        // =====================================================
        // Banner slide show

        function changeBannerSlide(index) {
          bannerSlides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
          });
          bannerDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
            dot.setAttribute("aria-selected", i === index ? "true" : "false");
            dot.tabIndex = i === index ? 0 : -1;
          });
          const activeSlide = bannerSlides[index];
          if (activeSlide) {
            bannerDesc.textContent = activeSlide.alt;
          }
          currentBannerIndex = index;
        }

        bannerDots.forEach((dot) => {
          dot.addEventListener("click", () => {
            changeBannerSlide(parseInt(dot.dataset.index));
            resetBannerInterval();
          });
          dot.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              changeBannerSlide(parseInt(dot.dataset.index));
              resetBannerInterval();
            }
          });
        });

        function nextBannerSlide() {
          let nextIndex = (currentBannerIndex + 1) % bannerSlides.length;
          changeBannerSlide(nextIndex);
        }

        function resetBannerInterval() {
          clearInterval(bannerInterval);
          bannerInterval = setInterval(nextBannerSlide, 7000);
        }

        bannerInterval = setInterval(nextBannerSlide, 7000);

        // =====================================================
        // Flash sale countdown timer (misal 1 jam dari saat halaman dimuat)
        const flashSaleDuration = 60 * 60 * 1000;
        const flashSaleEnd = Date.now() + flashSaleDuration;
        function updateCountdown() {
          const now = Date.now();
          let diff = flashSaleEnd - now;
          if (diff < 0) diff = 0;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          countdownHours.textContent = hours.toString().padStart(2, "0");
          countdownMinutes.textContent = minutes.toString().padStart(2, "0");
          countdownSeconds.textContent = seconds.toString().padStart(2, "0");
        }
        setInterval(updateCountdown, 1000);
        updateCountdown();

        // =====================================================
        // Filter, sortir, dan cari produk di halaman produk

        function filterAndSortProducts() {
          let filtered = [...products];
          const flavorFilter = filterFlavorSelect.value;
          const sortValue = filterSortSelect.value;
          const searchKeyword = productsSearchInput.value.trim().toLowerCase();

          if (flavorFilter !== "all") {
            filtered = filtered.filter((p) => p.flavor === flavorFilter);
          }
          if (searchKeyword !== "") {
            filtered = filtered.filter((p) =>
              p.name.toLowerCase().includes(searchKeyword)
            );
          }
          // Sort
          switch (sortValue) {
            case "price-asc":
              filtered.sort((a, b) => a.price - b.price);
              break;
            case "price-desc":
              filtered.sort((a, b) => b.price - a.price);
              break;
            case "rating-desc":
              filtered.sort((a, b) => b.rating - a.rating);
              break;
            default:
              break;
          }
          renderProductGrid(productsProductGrid, filtered);
        }

        filterSortSelect.addEventListener("change", filterAndSortProducts);
        filterFlavorSelect.addEventListener("change", filterAndSortProducts);
        productsSearchBtn.addEventListener("click", filterAndSortProducts);
        productsSearchInput.addEventListener("keyup", (e) => {
          if (e.key === "Enter") filterAndSortProducts();
        });

        // =====================================================
        // Search produk di home - cari dan filter
        searchInput.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            // Cari produk serupa di halaman produk
            switchSection("products");
            productsSearchInput.value = searchInput.value;
            filterAndSortProducts();
          }
        });
        searchInput.nextElementSibling.addEventListener("click", () => {
          switchSection("products");
          productsSearchInput.value = searchInput.value;
          filterAndSortProducts();
        });

        // =====================================================
        // Filter produk dari halaman kategori
        document.querySelectorAll(".category-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            switchSection("products");
            filterFlavorSelect.value = btn.dataset.flavor;
            filterAndSortProducts();
          });
        });

        // =====================================================
        // Login dan akun
        function updateUserUI() {
          if (currentUser) {
            userInfo.textContent = `Selamat datang, ${currentUser}!`;
            accountForms.hidden = true;
            accountContent.hidden = false;
            btnLogin.style.display = "none";
          } else {
            userInfo.textContent = "";
            accountForms.hidden = false;
            accountContent.hidden = true;
            btnLogin.style.display = "inline-block";
          }
        }

        btnLogin.addEventListener("click", () => {
          modalLogin.classList.add("show");
          modalLogin.focus();
        });

        modalLoginClose.addEventListener("click", () => {
          modalLogin.classList.remove("show");
          loginForm.reset();
          loginErrorMsg.style.display = "none";
        });

        modalLogin.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            modalLogin.classList.remove("show");
            loginForm.reset();
            loginErrorMsg.style.display = "none";
          }
        });

        loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const username = loginForm.username.value.trim();
          if (!username) {
            loginErrorMsg.textContent = "Nama pengguna tidak boleh kosong.";
            loginErrorMsg.style.display = "block";
            return;
          }
          currentUser = username;
          localStorage.setItem("kulokUser", username);
          updateUserUI();
          modalLogin.classList.remove("show");
          loginForm.reset();
          loginErrorMsg.style.display = "none";
          alert(`Selamat datang, ${username}!`);
          switchSection("account");
        });

        // =====================================================
        // Popup promo mingguan, muncul otomatis sekali per sesi
        const promoSeenKey = "kulokPromoSeen";
        function showPromoPopup() {
          if (!sessionStorage.getItem(promoSeenKey)) {
            promoPopup.classList.add("show");
            sessionStorage.setItem(promoSeenKey, "true");
          }
        }
        promoCloseBtn.addEventListener("click", () => {
          promoPopup.classList.remove("show");
        });

        // =====================================================
        // Animasi tambah produk ke keranjang
        function animateAddToCart(card) {
          const rect = card.getBoundingClientRect();
          const cartRect = cartBtn.getBoundingClientRect();
          const img = card.querySelector("img");
          if (!img) return;

          const flyImg = img.cloneNode(true);
          flyImg.style.position = "fixed";
          flyImg.style.left = rect.left + "px";
          flyImg.style.top = rect.top + "px";
          flyImg.style.width = rect.width + "px";
          flyImg.style.height = rect.height + "px";
          flyImg.style.borderRadius = "16px";
          flyImg.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
          flyImg.style.zIndex = 2000;
          document.body.appendChild(flyImg);

          requestAnimationFrame(() => {
            flyImg.style.left = cartRect.left + "px";
            flyImg.style.top = cartRect.top + "px";
            flyImg.style.width = "28px";
            flyImg.style.height = "28px";
            flyImg.style.opacity = "0.6";
          });
          setTimeout(() => {
            flyImg.remove();
          }, 800);
        }

        // Pasang animasi tambah ke keranjang pada grid home produk
        homeProductGrid.addEventListener("click", (e) => {
          let card = e.target.closest(".product-card");
          if (card) {
            const productId = card.dataset.productId;
            const product = products.find((p) => p.id === productId);
            if (!product) return;
            addToCart(product, 1);
            animateAddToCart(card);
          }
        });

        // =====================================================
        // Inisialisasi awal
        function init() {
          renderProductGrid(homeProductGrid, products);
          renderProductGrid(productsProductGrid, products);
          updateCartCount();
          updateUserUI();
          showPromoPopup();
        }

        init();
      })();