fetch('/api/products')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('product-list');

        if (!Array.isArray(data)) {
            throw new Error('Ответ от сервера — не массив!');
        }

        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('product');
            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p><strong>${item.price} ₽</strong></p>
                ${item.image_url ? `<img src="${item.image_url}" width="200" />` : ''}
            `;
            container.appendChild(div);
        });
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
    });
