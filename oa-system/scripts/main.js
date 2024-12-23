import { LanguageManager } from './modules/language.js';
import { CompanyMap } from './modules/map.js';

document.addEventListener('DOMContentLoaded', () => {
    // 初始化语言管理器
    const langManager = new LanguageManager();
    
    // 初始化地图
    const companyMap = new CompanyMap();
    
    // 其他初始化代码...
}); 