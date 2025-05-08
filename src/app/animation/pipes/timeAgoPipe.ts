import { Pipe, PipeTransform } from '@angular/core';

type TimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(createdUtcTime: string): string {
    const currentUtcTime = new Date();
    const createdTime = new Date(createdUtcTime);
console.log("time in utc"+createdTime+"current"+currentUtcTime)
    const diffInSeconds = Math.floor((currentUtcTime.getTime() - createdTime.getTime()) / 1000);

    const intervals: Record<TimeUnit, number> = {
      'year': 31536000,
      'month': 2592000,
      'week': 604800,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    };

    let counter;
    for (const unit in intervals) {
      if (intervals.hasOwnProperty(unit)) {
        counter = Math.floor(diffInSeconds / intervals[unit as TimeUnit]);
        if (counter > 0) {
          return counter === 1 ? counter + ' ' + unit + ' ago' : counter + ' ' + unit + 's ago';
        }
      }
    }

    return 'Just now';
  }
}
