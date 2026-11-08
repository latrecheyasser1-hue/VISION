# One order through the system

- click: frames0–132; ضغطة واحدة على تأكيد الطلب. ماذا يحدث خلف الشاشة؟; hero in compositions/click.html
- payload: frames133–321; تجمع الواجهة البيانات: رقم المنتج، والكمية المطلوبة. هذه البيانات تسمى Payload.; hero in compositions/payload.html
- request: frames322–436; يرسل Frontend طلب HTTP Request عبر API إلى Backend.; hero in compositions/request.html
- validation: frames437–611; هنا تبدأ Validation: بيانات صحيحة، سعر محسوب في الخادم، ومخزون متوفر.; hero in compositions/validation.html
- database: frames612–762; بعد التحقق، يحفظ الطلب في Database. الآن أصبح له رقم يمكن تتبعه.; hero in compositions/database.html
- response: frames763–904; ثم يعود Response إلى الواجهة: 201 Created. تم إنشاء الطلب.; hero in compositions/response.html
- complete: frames905–1093; Frontend، Backend، Database. ضغطة واحدة، ورحلة كاملة من البيانات.; hero in compositions/complete.html