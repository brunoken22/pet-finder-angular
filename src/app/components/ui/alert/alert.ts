import { Component, Input } from '@angular/core';
import { AlertType } from '../../../core/modules/alert.interface';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
})
export class AlertComponent {
  @Input() type: AlertType = 'default';
  @Input() message: string = '';

  // Mapeo de tipos a clases de Tailwind
  alertConfig = {
    info: {
      border: 'border-blue-300 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-400',
      bg: 'bg-blue-50',
      icon: 'text-blue-800',
    },
    danger: {
      border: 'border-red-300 dark:border-red-800',
      text: 'text-red-800 dark:text-red-400',
      bg: 'bg-red-50',
      icon: 'text-red-800',
    },
    success: {
      border: 'border-green-300 dark:border-green-800',
      text: 'text-green-800 dark:text-green-400',
      bg: 'bg-green-50',
      icon: 'text-green-800',
    },
    warning: {
      border: 'border-yellow-300 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-300',
      bg: 'bg-yellow-50',
      icon: 'text-yellow-800',
    },
    default: {
      border: 'border-gray-300 dark:border-gray-600',
      text: 'text-gray-800 dark:text-gray-300',
      bg: 'bg-gray-50',
      icon: 'dark:text-gray-300',
    },
  };

  get alertClasses() {
    const config = this.alertConfig[this.type] || this.alertConfig.default;
    return {
      container: `flex items-center p-4 mb-4 border-t-4 ${config.border} ${config.bg}`,
      text: `ms-3 text-sm font-medium ${config.text}`,
      icon: `shrink-0 w-4 h-4 ${config.icon}`,
    };
  }
  ngOnInit() {
    console.log(this.type, this.message);
  }
}
