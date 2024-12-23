export class CompanyMap {
    constructor() {
        this.map = null;
        this.marker = null;
        this.infoWindow = null;
        this.init();
    }

    init() {
        // 确保百度地图 API 已加载
        if (typeof BMap === 'undefined') {
            console.error('百度地图 API 未加载');
            return;
        }

        // 创建地图实例
        this.map = new BMap.Map('companyMap');
        
        // 设置中心点坐标（重庆江北区金融城）
        const point = new BMap.Point(106.575234, 29.607544);
        
        // 初始化地图
        this.map.centerAndZoom(point, 17);
        
        // 添加地图控件
        this.addMapControls();
        
        // 添加标记点
        this.addMarker(point);
        
        // 添加信息窗口
        this.addInfoWindow();
    }

    addMapControls() {
        // 添加缩放控件
        this.map.addControl(new BMap.ZoomControl());
        
        // 添加比例尺控件
        this.map.addControl(new BMap.ScaleControl());
        
        // 启用滚轮缩放
        this.map.enableScrollWheelZoom();
        
        // 启用双击放大
        this.map.enableDoubleClickZoom();
    }

    addMarker(point) {
        // 创建标记
        this.marker = new BMap.Marker(point);
        
        // 将标记添加到地图中
        this.map.addOverlay(this.marker);
        
        // 添加点击事件
        this.marker.addEventListener('click', () => {
            this.infoWindow.open(this.marker);
        });
    }

    addInfoWindow() {
        // 创建信息窗口内容
        const content = `
            <div class="map-info-window">
                <h4>中船海装</h4>
                <p>地址：重庆市江北区金融城2号T3栋</p>
                <p>电话：023-12345678</p>
            </div>
        `;
        
        // 创建信息窗口
        this.infoWindow = new BMap.InfoWindow(content, {
            width: 300,
            height: 120,
            title: ''
        });
    }
} 