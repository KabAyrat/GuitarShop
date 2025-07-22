let allProducts = [];
        let filteredProducts = [];

        // Плавная прокрутка к каталогу
        function scrollToCatalog() {
            document.getElementById('catalog').scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Загрузка товаров
        async function loadProducts() {
            try {
                const response = await fetch('/api/products');
                const products = await response.json();
                allProducts = products;
                filteredProducts = [...products];
                
                populateFilters();
                displayProducts();
            } catch (error) {
                console.error('Ошибка при загрузке товаров:', error);
                document.getElementById('product-list').innerHTML = 
                    '<div class="no-products">Ошибка при загрузке товаров</div>';
            }
        }

        // Заполнение фильтров
        function populateFilters() {
            const types = [...new Set(allProducts.map(p => p.type).filter(Boolean))];
            const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
            
            const typeSelect = document.getElementById('type-filter');
            const brandSelect = document.getElementById('brand-filter');
            
            typeSelect.innerHTML = '<option value="">Все типы</option>';
            brandSelect.innerHTML = '<option value="">Все бренды</option>';
            
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelect.appendChild(option);
            });
            
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            });
        }

        // Отображение товаров
        function displayProducts() {
            const productList = document.getElementById('product-list');
            
            if (filteredProducts.length === 0) {
                productList.innerHTML = '<div class="no-products">Товары не найдены</div>';
                return;
            }

            const productsHTML = `
                <div class="products-grid">
                    ${filteredProducts.map(product => `
                        <div class="product-card">
                            <img src="${product.image_url || 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}" 
                                 alt="${product.name}" 
                                 class="product-image">
                            <div class="product-info">
                                <div class="product-brand">${product.brand || 'Неизвестный бренд'}</div>
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-description">${product.description || 'Описание отсутствует'}</p>
                                <div class="product-specs">
                                    ${product.type ? `<span class="spec-tag">${product.type}</span>` : ''}
                                    ${product.body_material ? `<span class="spec-tag">${product.body_material}</span>` : ''}
                                    ${product.strings_count ? `<span class="spec-tag">${product.strings_count} струн</span>` : ''}
                                </div>
                                <div class="product-price">${parseFloat(product.price).toLocaleString('ru-RU')} ₽</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            productList.innerHTML = productsHTML;
        }

        // Применение фильтров
        function applyFilters() {
            const sortBy = document.getElementById('sort-select').value;
            const typeFilter = document.getElementById('type-filter').value;
            const brandFilter = document.getElementById('brand-filter').value;
            const priceMin = parseFloat(document.getElementById('price-min').value) || 0;
            const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity;

            // Фильтрация
            filteredProducts = allProducts.filter(product => {
                return (!typeFilter || product.type === typeFilter) &&
                       (!brandFilter || product.brand === brandFilter) &&
                       (parseFloat(product.price) >= priceMin) &&
                       (parseFloat(product.price) <= priceMax);
            });

            // Сортировка
            filteredProducts.sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'price-low':
                        return parseFloat(a.price) - parseFloat(b.price);
                    case 'price-high':
                        return parseFloat(b.price) - parseFloat(a.price);
                    case 'brand':
                        return (a.brand || '').localeCompare(b.brand || '');
                    default:
                        return 0;
                }
            });

            displayProducts();
        }

        // Сброс фильтров
        function resetFilters() {
            document.getElementById('sort-select').value = 'name';
            document.getElementById('type-filter').value = '';
            document.getElementById('brand-filter').value = '';
            document.getElementById('price-min').value = '';
            document.getElementById('price-max').value = '';
            
            filteredProducts = [...allProducts];
            applyFilters();
        }

        // Обработчики событий для фильтров
        document.addEventListener('DOMContentLoaded', () => {
            loadProducts();
            
            document.getElementById('sort-select').addEventListener('change', applyFilters);
            document.getElementById('type-filter').addEventListener('change', applyFilters);
            document.getElementById('brand-filter').addEventListener('change', applyFilters);
            document.getElementById('price-min').addEventListener('input', applyFilters);
            document.getElementById('price-max').addEventListener('input', applyFilters);
        });