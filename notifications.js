// استيراد مكتبة الإشعارات من كاباسيتور
const { LocalNotifications } = Capacitor.Plugins;

// طلب الإذن من المستخدم لإرسال الإشعارات عند فتح الصفحة لأول مرة
async function initializeNotifications() {
  let permissions = await LocalNotifications.checkPermissions();
  if (permissions.display === 'prompt') {
    permissions = await LocalNotifications.requestPermissions();
  }
  if (permissions.display !== 'granted') {
    console.log('User did not grant notification permissions');
    // يمكنك هنا عرض رسالة للمستخدم تشرح أهمية الإشعارات
  }
}

// دالة لجدولة إشعارات لمهمة معينة
async function scheduleTaskNotifications(task, index) {
  try {
    const now = new Date();
    const [hours, minutes] = task.time.split(':').map(Number);

    // حساب وقت الإشعار الأساسي (في نفس وقت المهمة)
    const scheduleTime = new Date();
    scheduleTime.setHours(hours, minutes, 0, 0);

    // حساب وقت الإشعار المسبق (قبل 5 دقائق)
    const scheduleTimeBefore = new Date(scheduleTime.getTime() - 5 * 60 * 1000);

    const notifications = [];

    // 1. الإشعار في وقت المهمة
    if (scheduleTime > now) {
      notifications.push({
        id: (index * 10) + 1, // معرف فريد للإشعار الأساسي
        title: "حان وقت مهمتك!",
        body: `مهمة: "${task.title}"`,
        schedule: { at: scheduleTime },
        smallIcon: 'res://mipmap/ic_launcher_round',
        sound: 'default'
      });
    }

    // 2. الإشعار قبل 5 دقائق
    if (scheduleTimeBefore > now) {
      notifications.push({
        id: (index * 10) + 2, // معرف فريد لإشعار التنبيه المسبق
        title: "تذكير بقرب مهمة",
        body: `"${task.title}" ستبدأ خلال 5 دقائق.`,
        schedule: { at: scheduleTimeBefore },
        smallIcon: 'res://mipmap/ic_launcher_round',
        sound: 'default'
      });
    }
    
    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
      console.log('Scheduled notifications for task:', task.title);
    }

  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

// دالة لإلغاء إشعارات مهمة معينة (عند حذفها أو تعديلها)
async function cancelTaskNotifications(index) {
  try {
    const notificationIds = [
      (index * 10) + 1, // معرف الإشعار الأساسي
      (index * 10) + 2  // معرف إشعار التنبيه المسبق
    ];
    await LocalNotifications.cancel({ notifications: notificationIds.map(id => ({ id })) });
    console.log('Cancelled notifications for task index:', index);
  } catch(error) {
    console.error('Error cancelling notifications:', error);
  }
}