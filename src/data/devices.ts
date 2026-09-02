/**
 * 设备展示页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/devicesConfig.ts 控制。
 */
import type { DeviceItem } from "@/types/devicesConfig";

export const devicesData: DeviceItem[] = [
	{
		id: "Lenovo-pro-16",
		name: 'Lenovo Xiaoxin Pro16 2022 Ryzen7',
		brand: "Lenovo",
		category: "desk",
		status: "active",
		specs: "R7 6800H / 680M / 16GB / 512GB",
		description:
			"Primary workstation for development, design.",
		icon: "material-symbols:laptop-mac-rounded",
		featured: true,
		year: "2022",
		link: "https://item.lenovo.com.cn/product/1022160.html",
	},
	{
		id: "Dada",
		name: "Xiaomi 15",
		brand: "Xiaomi",
		category: "mobile",
		status: "active",
		specs: "Snapdragon 8 Elite / 光影猎人900 / 16GB / 512GB",
		description:
			"Daily driver smartphone with outstanding cameras and a smooth 120Hz display.",
		icon: "material-symbols:phone-iphone",
		featured: true,
		year: "2024",
	},
	{
		id: "EAH-AZ80",
		name: "Technics EAH-AZ80",
		brand: "Panasonic",
		category: "audio",
		status: "active",
		specs: "Silver / ANC / LDAC",
		description:
			"Industry-leading noise-canceling headphones for immersive coding sessions and travels.",
		icon: "material-symbols:headphones-rounded",
		year: "2023",
	},
	{
		id: "custom-keyboard-75",
		name: "Custom 75% Mechanical Keyboard",
		brand: "Custom",
		category: "peripheral",
		status: "active",
		specs: "Anodized Aluminum / Linear Switches",
		description:
			"Custom gasket-mounted keyboard tuned for deep, quiet typing acoustics.",
		icon: "material-symbols:keyboard-outline-rounded",
		year: "2025",
	},
	{
		id: "samsung-tabs9",
		name: 'Samsung Galaxy Tab S9',
		brand: "Samsung",
		category: "mobile",
		status: "backup",
		specs: "Space Gray / 128GB",
		description:
			"Secondary mobile screen and digital notepad for sketching ideas and reading papers.",
		icon: "material-symbols:tablet-mac-rounded",
		year: "2022",
	},
];

/** 获取所有设备数据列表 */
export function getDevicesList(): DeviceItem[] {
	return devicesData;
}
