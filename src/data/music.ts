import type { TrackDescriptor } from "@/types/musicConfig";

/**
 * 侧栏音乐本地曲目数据源。
 * 遵循「零额外负担」原则：配置与数据解耦，此处专用于管理本地曲目列表。
 *
 * 添加曲目：在 musicTracks 中追加一项即可：
 * - id: 唯一标识
 * - title: 曲目标题
 * - artist: 艺术家（可选）
 * - cover: 封面图地址（可选；推荐相对 /src，亦支持 /public 或绝对 URL）
 * - source: 音频文件地址（相对 /public 或绝对 URL）
 * - duration: 曲目时长（秒，可选）
 */
export const musicTracks: readonly TrackDescriptor[] = [

	{
		id: "krkr",
		title: "初星学園,紫雲清夏 - Kira Kira",
		artist: "紫雲清夏",
		cover: "assets/images/music/krkr.webp",
		source: "/assets/music/url/krkr.mp3",
		duration: 186,
	},
	
	{
		id: "lj",
		title: "初星学園,紫雲清夏 - Love & Joy",
		artist: "紫雲清夏",
		cover: "assets/images/music/lj.webp",
		source: "/assets/music/url/lj.mp3",
		duration: 234,
	},
	{
		id: "nanimono",
		title: "電音部,東海林桃々子(CVMone) - NANIMONO",
		artist: "東海林桃々子(CVMone)",
		cover: "assets/images/music/nanimono.webp",
		source: "/assets/music/url/nanimono.mp3",
		duration: 203,
	},
	{
		id: "gnb",
		title: "電音部,Moe Shop,長谷川玲奈 - good night baby",
		artist: "長谷川玲奈",
		cover: "assets/images/music/gnb.webp",
		source: "/assets/music/url/gnb.mp3",
		duration: 240,
	},
	{
		id: "ib",
		title: "電音部,ケンモチヒデフミ,秋奈 - いただきバベル",
		artist: "ケンモチヒデフミ,秋奈",
		cover: "assets/images/music/ib.webp",
		source: "/assets/music/url/ib.mp3",
		duration: 213,
	},
	{
		id: "dazbee",
		title: "口笛で愛は歌えない",
		artist: "Dazbee",
		cover: "assets/images/music/dazbee.webp",
		source: "/assets/music/url/dazbee.mp3",
		duration: 241,
	},

	// {
	// 	id: "hitori",
	// 	title: "ひとり上手",
	// 	artist: "Kaya",
	// 	cover: "assets/images/music/hitori.webp",
	// 	source: "/assets/music/url/hitori.mp3",
	// 	duration: 253,
	// },
	// {
	// 	id: "xryx",
	// 	title: "眩耀夜行",
	// 	artist: "スリーズブーケ",
	// 	cover: "assets/images/music/xryx.webp",
	// 	source: "/assets/music/url/xryx.mp3",
	// 	duration: 245,
	// },
	// {
	// 	id: "cl",
	// 	title: "春雷の頃",
	// 	artist: "22/7",
	// 	cover: "assets/images/music/cl.webp",
	// 	source: "/assets/music/url/cl.mp3",
	// 	duration: 242,
	// },
];
