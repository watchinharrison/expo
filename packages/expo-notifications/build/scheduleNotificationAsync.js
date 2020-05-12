import uuidv4 from 'uuid/v4';
import NotificationScheduler from './NotificationScheduler';
export default async function scheduleNotificationAsync(request) {
    return await NotificationScheduler.scheduleNotificationAsync(request.identifier ?? uuidv4(), request.content, parseTrigger(request.trigger));
}
function parseTrigger(userFacingTrigger) {
    if (userFacingTrigger === null) {
        return null;
    }
    if (userFacingTrigger === undefined) {
        throw new TypeError('Encountered an `undefined` notification trigger. If you want to trigger the notification immediately, pass in an explicit `null` value.');
    }
    if (userFacingTrigger instanceof Date) {
        return { type: 'date', timestamp: userFacingTrigger.getTime() };
    }
    else if (typeof userFacingTrigger === 'number') {
        return { type: 'date', timestamp: userFacingTrigger };
    }
    else if (
    // eg. { seconds: ..., repeats: ..., hour: ... }
    ('seconds' in userFacingTrigger &&
        'repeats' in userFacingTrigger &&
        Object.keys(userFacingTrigger).length > 2) ||
        // eg. { seconds: ..., hour: ... }
        ('seconds' in userFacingTrigger &&
            !('repeats' in userFacingTrigger) &&
            Object.keys(userFacingTrigger).length > 1)) {
        throw new TypeError('Could not have inferred the notification trigger type: if you want to use a time interval trigger, pass in only `seconds` with or without `repeats` property; if you want to use calendar-based trigger, pass in `second`.');
    }
    else if ('seconds' in userFacingTrigger) {
        return {
            type: 'timeInterval',
            seconds: userFacingTrigger.seconds,
            repeats: userFacingTrigger.repeats ?? false,
        };
    }
    else {
        const { repeats, ...calendarTrigger } = userFacingTrigger;
        return { type: 'calendar', value: calendarTrigger, repeats };
    }
}
//# sourceMappingURL=scheduleNotificationAsync.js.map