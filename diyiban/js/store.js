/* IP 商店下单流程（演示版）：表单校验 -> 订单号 -> localStorage 记录 */
(function () {
    var modal = document.getElementById('orderModal');
    var overlay = document.getElementById('orderOverlay');
    if (!modal || !overlay) return;

    var current = { name: '', price: 0 };
    var qtyEl = document.getElementById('orderQty');
    var totalEl = document.getElementById('orderTotal');
    var payEl = document.getElementById('orderPay');
    var form = document.getElementById('orderForm');
    var successBox = document.getElementById('orderSuccess');

    function openOrder(productName, price) {
        current = { name: productName, price: price };
        document.getElementById('orderProduct').textContent = productName;
        document.getElementById('orderPrice').textContent = '¥' + price;
        qtyEl.value = 1;
        form.style.display = '';
        successBox.style.display = 'none';
        updateTotal();
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeOrder() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    function updateTotal() {
        var q = Math.max(1, parseInt(qtyEl.value, 10) || 1);
        totalEl.textContent = '¥' + (current.price * q).toLocaleString();
    }

    document.querySelectorAll('[data-order]').forEach(function (b) {
        b.addEventListener('click', function () {
            openOrder(b.dataset.order, parseFloat(b.dataset.price || '0'));
        });
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOrder(); });
    document.getElementById('orderClose').addEventListener('click', closeOrder);
    document.getElementById('orderCancel').addEventListener('click', closeOrder);
    document.getElementById('orderDone').addEventListener('click', closeOrder);
    qtyEl.addEventListener('input', updateTotal);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('fName').value.trim();
        var phone = document.getElementById('fPhone').value.trim();
        var addr = document.getElementById('fAddr').value.trim();
        var email = document.getElementById('fEmail').value.trim();
        var qty = Math.max(1, parseInt(qtyEl.value, 10) || 1);
        if (!name || !phone || !addr) {
            alert('请填写收货人、联系电话和收货地址 / Please fill in recipient, phone and address.');
            return;
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('邮箱格式不正确 / Invalid email.');
            return;
        }
        var orderNo = 'DFCX-' + Date.now().toString(36).toUpperCase().slice(-6);
        var record = {
            no: orderNo, product: current.name, qty: qty,
            total: current.price * qty, pay: payEl.value,
            name: name, phone: phone, addr: addr, email: email,
            note: document.getElementById('fNote').value.trim(), ts: Date.now()
        };
        var history = [];
        try { history = JSON.parse(localStorage.getItem('ip-store-orders') || '[]'); } catch (err) {}
        history.unshift(record);
        try { localStorage.setItem('ip-store-orders', JSON.stringify(history)); } catch (err) {}
        form.style.display = 'none';
        successBox.style.display = 'block';
        document.getElementById('orderNo').textContent = orderNo;
    });
})();
