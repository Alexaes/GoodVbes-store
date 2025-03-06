exports.handler = async function(event, context) {
    const { product_id, quantity } = JSON.parse(event.body); // استلام البيانات من العميل

    console.log(`تم إضافة منتج: ID ${product_id} - الكمية: ${quantity}`);

    // هنا يمكنك إضافة الكود لتخزين البيانات في قاعدة بيانات أو إرسالها عبر البريد الإلكتروني

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'تم إضافة العنصر إلى السلة!' })
    };
};