// Конфигурации бланков заказа — столбцы для каждого типа калькулятора
// "auto:field" — автозаполняется из данных строки
// Остальные — редактируемые поля

export interface OrderColumn {
  key: string;      // Уникальный ключ
  label: string;    // Заголовок
  auto?: string;    // Автозаполнение: "fabric", "fabricColor", "width", "height", "quantity", "category", "opt:XXX"
  wide?: boolean;   // Широкий столбец (горизонтальный заголовок, перенос слов)
}

export interface OrderFormConfig {
  title: string;
  columns: OrderColumn[];
  electricColumns: OrderColumn[];
}

// === Общие столбцы ===
const COL_FABRIC: OrderColumn = { key: "fabric", label: "Наименование ткани", auto: "fabric", wide: true };
const COL_FABRIC_COLOR: OrderColumn = { key: "fabricColor", label: "Цвет ткани", auto: "fabricColor" };
const COL_WIDTH: OrderColumn = { key: "width", label: "Ширина (м)", auto: "width" };
const COL_HEIGHT: OrderColumn = { key: "height", label: "Высота (м)", auto: "height" };
const COL_QTY: OrderColumn = { key: "qty", label: "Кол-во (шт.)", auto: "quantity" };
const COL_CONTROL: OrderColumn = { key: "control", label: "Управление (сторона)" };
const COL_CONTROL_LEN: OrderColumn = { key: "controlLen", label: "Длина управления (м)" };
const COL_COLOR_FURN: OrderColumn = { key: "colorFurn", label: "Цвет фурнитуры", auto: "opt:color" };
const COL_SIDE_FIX: OrderColumn = { key: "sideFix", label: "Боковая фиксация", auto: "opt:sideFix" };
const COL_CHAIN_TENS: OrderColumn = { key: "chainTens", label: "Натяжитель цепи", auto: "opt:chainTensioner" };
const COL_INSTALL: OrderColumn = { key: "install", label: "Тип установки" };
const COL_RING: OrderColumn = { key: "ring", label: "Кольцо подкладочное" };
const COL_ROLL: OrderColumn = { key: "roll", label: "Рулон" };
const COL_HIDDEN_GUIDE: OrderColumn = { key: "hiddenGuide", label: "Скрытая направляющая" };

// === Электрика ===
const COL_AUTO_TYPE: OrderColumn = { key: "autoType", label: "Тип автоматики" };
const COL_DRIVE_TYPE: OrderColumn = { key: "driveType", label: "Тип электропривода", auto: "opt:electric", wide: true };
const COL_DEVICE_CH: OrderColumn = { key: "deviceCh", label: "Устройство управления / канал", wide: true };

// ============================================================
// MINI / MINI-Зебра
// ============================================================
const miniBase: OrderColumn[] = [
  { key: "type", label: "Вид изделия", auto: "_title", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthProd", label: "Ширина изд. (м)", auto: "width" },
  { key: "widthFabric", label: "Ширина ткани (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL, COL_CONTROL_LEN,
  COL_COLOR_FURN,
  { key: "weight", label: "Грузик цепи", auto: "opt:weight" },
  { key: "metalChain", label: "Метал. цепь", auto: "opt:metalChain" },
  COL_ROLL, COL_INSTALL, COL_RING, COL_SIDE_FIX, COL_HIDDEN_GUIDE, COL_CHAIN_TENS,
];
const miniElectric: OrderColumn[] = [
  { key: "type", label: "Вид изделия", auto: "_title", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthProd", label: "Ширина изд. (м)", auto: "width" },
  { key: "widthFabric", label: "Ширина ткани (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL,
  COL_COLOR_FURN, COL_ROLL, COL_INSTALL, COL_RING, COL_SIDE_FIX, COL_HIDDEN_GUIDE,
  COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// MG / MGS-Зебра
// ============================================================
const mgBase: OrderColumn[] = [
  { key: "type", label: "Вид изделия", auto: "_title", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthProd", label: "Ширина изд. (м)", auto: "width" },
  { key: "widthFabric", label: "Ширина ткани (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL, COL_CONTROL_LEN,
  COL_COLOR_FURN,
  { key: "chainType", label: "Тип цепи", auto: "opt:chain" },
  { key: "weight", label: "Грузик цепи", auto: "opt:weight" },
  { key: "rail", label: "Рейка нижняя", auto: "opt:rail" },
  { key: "mountProfile", label: "Монтажный профиль", auto: "opt:mountProfile" },
  { key: "box", label: "Короб", auto: "opt:box" },
  COL_INSTALL,
];
const mgElectric: OrderColumn[] = [
  { key: "type", label: "Вид изделия", auto: "_title", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthProd", label: "Ширина изд. (м)", auto: "width" },
  { key: "widthFabric", label: "Ширина ткани (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL,
  COL_COLOR_FURN,
  { key: "rail", label: "Рейка нижняя", auto: "opt:rail" },
  { key: "mountProfile", label: "Монтажный профиль", auto: "opt:mountProfile" },
  { key: "box", label: "Короб", auto: "opt:box" },
  COL_INSTALL, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// BNT M/L, Кассета BNT, Зебра BNT, AMG, AMG L/XL, Lift
// ============================================================
const benthinBase: OrderColumn[] = [
  { key: "type", label: "Тип изделия", auto: "_title", wide: true },
  { key: "complect", label: "Комплектация", auto: "opt:tube|cassette" },
  { key: "complectColor", label: "Цвет комплектации", auto: "opt:color" },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthProd", label: "Ширина изд. (м)", auto: "width" },
  { key: "widthFabric", label: "Ширина ткани (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL, COL_CONTROL_LEN,
  { key: "adjPlug", label: "Заглушка регулируемая", auto: "opt:adjustablePlug" },
  COL_SIDE_FIX,
  { key: "chainType", label: "Тип цепи", auto: "opt:chain" },
  { key: "bigMech", label: "Больш. механизм", auto: "opt:bigMechanism" },
  { key: "weightDecor", label: "Грузик декор", auto: "opt:weightDecor|weight" },
  { key: "childSafety", label: "Детская безопасность", auto: "opt:childSafety" },
  { key: "bottomRail", label: "Рейка нижняя", auto: "opt:bottomRail" },
  { key: "mountProfile", label: "Монтажный профиль", auto: "opt:mountProfile" },
  { key: "specialModel", label: "Спец. модель", auto: "opt:specialModel|model" },
  { key: "bracket", label: "Кронштейн", auto: "opt:bracket" },
  { key: "spring", label: "Пружина", auto: "opt:spring" },
  { key: "reducer", label: "Редуктор", auto: "opt:reducer" },
  { key: "guides", label: "Направляющие", auto: "opt:guides" },
  { key: "mono", label: "MONO", auto: "opt:mono" },
  { key: "metalChain", label: "Метал. цепь", auto: "opt:metalChain" },
  COL_CHAIN_TENS,
  { key: "welding", label: "Сварка", auto: "opt:welding" },
  { key: "pocket", label: "Карман", auto: "opt:pocket" },
  { key: "fabricInsert", label: "Вставка ткани", auto: "opt:fabricInsert" },
  { key: "wallBracket", label: "Стен. кронштейн", auto: "opt:wallBracket" },
  { key: "extBracket", label: "Удл. кронштейн", auto: "opt:extBracket45" },
  COL_INSTALL,
];
const benthinElectric: OrderColumn[] = [
  { key: "type", label: "Тип изделия", auto: "_title", wide: true },
  { key: "complect", label: "Комплектация", auto: "opt:tube|cassette" },
  { key: "complectColor", label: "Цвет комплектации", auto: "opt:color" },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthProd", label: "Ширина изд. (м)", auto: "width" },
  { key: "widthFabric", label: "Ширина ткани (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL,
  { key: "adjPlug", label: "Заглушка регулируемая", auto: "opt:adjustablePlug" },
  COL_SIDE_FIX,
  { key: "bottomRail", label: "Рейка нижняя", auto: "opt:bottomRail" },
  { key: "mountProfile", label: "Монтажный профиль", auto: "opt:mountProfile" },
  { key: "specialModel", label: "Спец. модель", auto: "opt:specialModel|model" },
  { key: "bracket", label: "Кронштейн", auto: "opt:bracket" },
  { key: "guides", label: "Направляющие", auto: "opt:guides" },
  { key: "mono", label: "MONO", auto: "opt:mono" },
  COL_INSTALL, COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// UNI 1/2, UNI-Зебра, UNI2-Пружина
// ============================================================
const uniBase: OrderColumn[] = [
  { key: "type", label: "Вид изделия", auto: "_title", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthUni1", label: "Ширина UNI1 (м)", auto: "width" },
  { key: "widthUni2", label: "Ширина UNI2 (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL, COL_CONTROL_LEN,
  { key: "glazDepth", label: "Глубина штапика (мм)" },
  { key: "tilt", label: "Угол наклона рамы" },
  COL_COLOR_FURN,
  { key: "weight", label: "Грузик цепи", auto: "opt:weight" },
  { key: "metalChain", label: "Метал. цепь", auto: "opt:metalChain" },
  COL_RING, COL_INSTALL, COL_CHAIN_TENS,
];
const uniElectric: OrderColumn[] = [
  { key: "type", label: "Вид изделия", auto: "_title", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "widthUni1", label: "Ширина UNI1 (м)", auto: "width" },
  { key: "widthUni2", label: "Ширина UNI2 (м)" },
  COL_HEIGHT, COL_QTY, COL_CONTROL,
  { key: "glazDepth", label: "Глубина штапика (мм)" },
  { key: "tilt", label: "Угол наклона рамы" },
  COL_COLOR_FURN, COL_RING, COL_INSTALL, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Вертикальные жалюзи
// ============================================================
const verticalBase: OrderColumn[] = [
  { key: "material", label: "Материал ламелей", auto: "opt:material" },
  { key: "model", label: "Модель", auto: "opt:model" },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "chainType", label: "Тип цепи", auto: "opt:chain" },
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL_LEN, COL_CONTROL,
  { key: "lamelOnly", label: "Только ламели", auto: "opt:lamelOnly" },
  { key: "metalFurn", label: "Метал. фурнитура", auto: "opt:metalFurn" },
  { key: "transparentSet", label: "Прозрачн. комплект", auto: "opt:transparentSet" },
  { key: "decorCornice", label: "Декор. карниз", auto: "opt:decorCornice" },
  { key: "tilted", label: "Наклонная", auto: "opt:tilted" },
  { key: "groover", label: "Грувер" },
  { key: "grooverSides", label: "Боковины грувера" },
  { key: "ceilingBracket", label: "Тип потолочн. кронштейна" },
  { key: "wallBracket", label: "Стеновые кронштейны" },
  { key: "wallExt", label: "Удлинитель стен. кронштейна" },
];
const verticalElectric: OrderColumn[] = [
  { key: "material", label: "Материал ламелей", auto: "opt:material" },
  { key: "model", label: "Модель", auto: "opt:model" },
  COL_FABRIC, COL_FABRIC_COLOR,
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL,
  { key: "groover", label: "Грувер" },
  { key: "grooverSides", label: "Боковины грувера" },
  { key: "ceilingBracket", label: "Тип потолочн. кронштейна" },
  { key: "wallBracket", label: "Стеновые кронштейны" },
  { key: "wallExt", label: "Удлинитель стен. кронштейна" },
  COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Venus 16/25
// ============================================================
const venusBase: OrderColumn[] = [
  { key: "slatWidth", label: "Ширина ламели", auto: "opt:slat" },
  { key: "colorCode", label: "Цвет / код цвета", auto: "opt:color" },
  { key: "complColor", label: "Цвет комплектации", auto: "opt:complColor" },
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL, COL_CONTROL_LEN,
  COL_COLOR_FURN,
  { key: "noStop", label: "Без остановки", auto: "opt:noStop" },
  { key: "reducer", label: "Редуктор", auto: "opt:reducer" },
  { key: "shim", label: "Подкладка", auto: "opt:shim" },
  { key: "padTiles", label: "Кол-во подкл. плиток" },
  { key: "glazDepth", label: "Глубина штапика (мм)" },
];
const venusElectric: OrderColumn[] = [
  { key: "slatWidth", label: "Ширина ламели", auto: "opt:slat" },
  { key: "colorCode", label: "Цвет / код цвета", auto: "opt:color" },
  { key: "complColor", label: "Цвет комплектации", auto: "opt:complColor" },
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL,
  COL_COLOR_FURN,
  { key: "padTiles", label: "Кол-во подкл. плиток" },
  { key: "glazDepth", label: "Глубина штапика (мм)" },
  COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Дерево / Бамбук
// ============================================================
const dbBlindsBase: OrderColumn[] = [
  { key: "material", label: "Тип жалюзи (материал)", auto: "opt:material" },
  { key: "slatWidth", label: "Ширина ламели", auto: "opt:slat" },
  { key: "colorCode", label: "Цвет / код цвета", auto: "opt:color" },
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL, COL_INSTALL,
  { key: "valance", label: "Валанс угловой" },
  COL_SIDE_FIX,
  { key: "bottomFix", label: "Нижняя фиксация" },
  { key: "pvcFix", label: "ПВХ крепления 25мм" },
  { key: "decLadder", label: "Декор. лесенка 50мм", auto: "opt:decLadder" },
];
const dbBlindsElectric: OrderColumn[] = [
  ...dbBlindsBase, COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// ГЖ Алюминий
// ============================================================
const gzhBase: OrderColumn[] = [
  { key: "slatWidth", label: "Ширина ламели", auto: "opt:slat" },
  { key: "colorCode", label: "Цвет / код цвета", auto: "opt:color" },
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL, COL_INSTALL,
  COL_SIDE_FIX,
  { key: "holderBottom", label: "Держатель нижний", auto: "opt:holderBottom" },
  { key: "pvcFix", label: "ПВХ крепления", auto: "opt:pvcFix" },
  { key: "interCeramics", label: "Интер-керамика", auto: "opt:interCeramics" },
  { key: "complexShape", label: "Сложная форма", auto: "opt:complexShape" },
  { key: "multiTape", label: "Мульти-лента", auto: "opt:multiTape" },
  { key: "decLadder", label: "Декор. лесенка", auto: "opt:decLadder50" },
];
const gzhElectric: OrderColumn[] = [
  ...gzhBase, COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Римские карнизы
// ============================================================
const romanRailsBase: OrderColumn[] = [
  { key: "type", label: "Тип карниза", auto: "opt:type" },
  COL_WIDTH, COL_HEIGHT, COL_CONTROL, COL_QTY,
  { key: "bracket", label: "Кронштейн", auto: "opt:bracket" },
  { key: "tilt", label: "Наклон", auto: "opt:tilt" },
  { key: "chain", label: "Цепь", auto: "opt:chain" },
  { key: "dayNight", label: "День/Ночь", auto: "opt:dayNight" },
  { key: "rod", label: "Стержень", auto: "opt:rod" },
  { key: "rodLength", label: "Длина стержня", auto: "opt:rodLength" },
  { key: "rodTip", label: "Наконечник", auto: "opt:rodTip" },
  { key: "weightBar", label: "Утяжелитель", auto: "opt:weightBar" },
  { key: "extraLace", label: "Доп. шнур", auto: "opt:extraLace" },
  { key: "velcro", label: "Велькро", auto: "opt:velcro" },
];
const romanRailsElectric: OrderColumn[] = [
  ...romanRailsBase, COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Римские шторы
// ============================================================
const romanBlindsBase: OrderColumn[] = [
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "type", label: "Тип", auto: "opt:type" },
  COL_WIDTH, COL_HEIGHT, COL_CONTROL, COL_QTY,
  { key: "bracket", label: "Кронштейн", auto: "opt:bracket" },
  { key: "weight", label: "Утяжелитель", auto: "opt:weight" },
  { key: "chain", label: "Цепь", auto: "opt:chain" },
  { key: "weightDecor", label: "Грузик декор", auto: "opt:weightDecor" },
  { key: "fabricOnly", label: "Только ткань", auto: "opt:fabricOnly" },
  { key: "tilt", label: "Наклон", auto: "opt:tilt" },
  { key: "dayNight", label: "День/Ночь", auto: "opt:dayNight" },
  COL_SIDE_FIX,
  { key: "tunnel", label: "Туннель", auto: "opt:tunnel" },
  { key: "kant", label: "Кант", auto: "opt:kant" },
];
const romanBlindsElectric: OrderColumn[] = [
  ...romanBlindsBase, COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Мираж
// ============================================================
const mirageBase: OrderColumn[] = [
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "fabricInsert", label: "Вставка ткани", auto: "opt:fabricInsert" },
  { key: "chainType", label: "Цепь", auto: "opt:chain" },
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL,
];
const mirageElectric: OrderColumn[] = [
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "fabricInsert", label: "Вставка ткани", auto: "opt:fabricInsert" },
  COL_WIDTH, COL_HEIGHT, COL_QTY, COL_CONTROL,
  COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Плиссе
// ============================================================
const plisseBase: OrderColumn[] = [
  { key: "model", label: "Модель", auto: "opt:model", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "cat", label: "Категория", auto: "opt:cat" },
  COL_WIDTH, COL_HEIGHT, COL_QTY,
  { key: "colorFurn", label: "Цвет фурнитуры", auto: "opt:color" },
  { key: "bracket", label: "Кронштейн", auto: "opt:bracket" },
  COL_CONTROL,
  { key: "cord", label: "Шнур с петлями", auto: "opt:cord" },
  { key: "reinforced", label: "Усиленный профиль", auto: "opt:reinforced" },
  { key: "mountProfile", label: "Монтажный профиль", auto: "opt:mountProfile" },
  { key: "handle", label: "Ручка", auto: "opt:handle" },
];
const plisseElectric: OrderColumn[] = [
  { key: "model", label: "Модель", auto: "opt:model", wide: true },
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "cat", label: "Категория", auto: "opt:cat" },
  COL_WIDTH, COL_HEIGHT, COL_QTY,
  { key: "colorFurn", label: "Цвет фурнитуры", auto: "opt:color" },
  { key: "bracket", label: "Кронштейн", auto: "opt:bracket" },
  COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Портьеры
// ============================================================
const curtainsBase: OrderColumn[] = [
  COL_FABRIC, COL_FABRIC_COLOR,
  COL_WIDTH, COL_HEIGHT, COL_QTY,
  { key: "cut", label: "Крой", auto: "opt:cut" },
  { key: "fold", label: "Складки", auto: "opt:fold" },
  { key: "lining", label: "Подклад", auto: "opt:lining" },
  { key: "liningCat", label: "Кат. подклада", auto: "opt:liningCat" },
];
const curtainsElectric: OrderColumn[] = [
  ...curtainsBase, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Roof (мансардные)
// ============================================================
const roofBase: OrderColumn[] = [
  COL_FABRIC, COL_FABRIC_COLOR,
  { key: "manufacturer", label: "Производитель окна", auto: "opt:manufacturer" },
  { key: "model", label: "Серия и модель окна", auto: "opt:model", wide: true },
  COL_WIDTH, COL_HEIGHT, COL_QTY,
];
const roofElectric: OrderColumn[] = [
  ...roofBase, COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// ZIP / LOCK
// ============================================================
const zipBase: OrderColumn[] = [
  COL_FABRIC, COL_FABRIC_COLOR,
  COL_WIDTH, COL_HEIGHT, COL_QTY,
  { key: "tube", label: "Труба", auto: "opt:tube" },
  { key: "box", label: "Короб", auto: "opt:box" },
  { key: "controlType", label: "Управление", auto: "opt:control" },
  { key: "crankZip", label: "Крэнк", auto: "opt:crankZip" },
  { key: "ral", label: "Покраска RAL", auto: "opt:ral" },
  { key: "weld", label: "Сварка (пог.м)", auto: "opt:weld" },
  { key: "corner", label: "Уголок (пог.м)", auto: "opt:corner" },
];
const zipElectric: OrderColumn[] = [
  ...zipBase, COL_AUTO_TYPE, COL_DRIVE_TYPE, COL_DEVICE_CH,
];

// ============================================================
// Шторные карнизы
// ============================================================
const curtainRailBase: OrderColumn[] = [
  { key: "model", label: "Модель", auto: "opt:model", wide: true },
  { key: "motor", label: "Тип привода", auto: "opt:motor" },
  COL_WIDTH, COL_CONTROL,
  { key: "opening", label: "Открытие", auto: "opt:opening" },
  { key: "bracket", label: "Кронштейн", auto: "opt:bracket" },
  { key: "bracketQty", label: "Кол-во кронштейнов", auto: "opt:bracketQty" },
  { key: "extraRunners", label: "Доп. бегунки", auto: "opt:extraRunners" },
  { key: "hooks", label: "Крючки", auto: "opt:hooks" },
  { key: "shortCap", label: "Короткая заглушка", auto: "opt:shortCap" },
  { key: "connector", label: "Соединитель", auto: "opt:connector" },
  { key: "bending", label: "Изгиб карниза", auto: "opt:bending" },
  { key: "amigoWifi", label: "AMIGO Wi-Fi+о/с", auto: "opt:amigoWifi" },
  { key: "bTrack", label: "Доп. трек B", auto: "opt:bTrack" },
  { key: "tiltRail", label: "Наклонный карниз", auto: "opt:tiltRail" },
  { key: "silentKit", label: "Silent крепёж", auto: "opt:silentKit" },
  { key: "silentRunner", label: "Silent бегунок", auto: "opt:silentRunner" },
  { key: "color", label: "Цвет", auto: "opt:color" },
  COL_QTY,
];
const curtainRailElectric: OrderColumn[] = [
  ...curtainRailBase, COL_DEVICE_CH,
];

// ============================================================
// Маппинг calcId → конфиг бланка
// ============================================================
const formConfigs: Record<string, OrderFormConfig> = {
  "mini":                { title: "MINI",                   columns: miniBase,         electricColumns: miniElectric },
  "mini-zebra":          { title: "MINI-Зебра",             columns: miniBase,         electricColumns: miniElectric },
  "mg":                  { title: "MG",                     columns: mgBase,           electricColumns: mgElectric },
  "mgs-zebra":           { title: "MGS Зебра",              columns: mgBase,           electricColumns: mgElectric },
  "bnt-m":               { title: "Benthin M",              columns: benthinBase,      electricColumns: benthinElectric },
  "bnt-l":               { title: "Benthin L",              columns: benthinBase,      electricColumns: benthinElectric },
  "kasseta-bnt-m":       { title: "Кассета Benthin M",      columns: benthinBase,      electricColumns: benthinElectric },
  "kasseta-bnt-l":       { title: "Кассета Benthin L",      columns: benthinBase,      electricColumns: benthinElectric },
  "zebra-bnt-m":         { title: "Зебра Benthin M",        columns: benthinBase,      electricColumns: benthinElectric },
  "zebra-bnt-l":         { title: "Зебра Benthin L",        columns: benthinBase,      electricColumns: benthinElectric },
  "zebra-kasseta-bnt-m": { title: "Зебра кассета Benthin M", columns: benthinBase,     electricColumns: benthinElectric },
  "amg":                 { title: "AMG",                    columns: benthinBase,      electricColumns: benthinElectric },
  "amg-l":               { title: "AMG L",                  columns: benthinBase,      electricColumns: benthinElectric },
  "amg-xl":              { title: "AMG XL",                 columns: benthinBase,      electricColumns: benthinElectric },
  "uni1":                { title: "UNI 1",                  columns: uniBase,          electricColumns: uniElectric },
  "uni1-zebra":          { title: "UNI 1 Зебра",            columns: uniBase,          electricColumns: uniElectric },
  "uni2":                { title: "UNI 2",                  columns: uniBase,          electricColumns: uniElectric },
  "uni2-zebra":          { title: "UNI 2 Зебра",            columns: uniBase,          electricColumns: uniElectric },
  "uni2-spring":         { title: "UNI 2 Пружина",          columns: uniBase,          electricColumns: uniElectric },
  "vertical-blinds":     { title: "Вертикальные жалюзи",    columns: verticalBase,     electricColumns: verticalElectric },
  "venus16":             { title: "Venus 16",               columns: venusBase,        electricColumns: venusElectric },
  "venus25":             { title: "Venus 25",               columns: venusBase,        electricColumns: venusElectric },
  "db-blinds":           { title: "Дерево / Бамбук",        columns: dbBlindsBase,     electricColumns: dbBlindsElectric },
  "gzh-blinds":          { title: "ГЖ Алюминий",            columns: gzhBase,          electricColumns: gzhElectric },
  "roman-rails":         { title: "Римский карниз",         columns: romanRailsBase,   electricColumns: romanRailsElectric },
  "roman-blinds":        { title: "Римские шторы",          columns: romanBlindsBase,  electricColumns: romanBlindsElectric },
  "mirage":              { title: "Мираж",                  columns: mirageBase,       electricColumns: mirageElectric },
  "roof":                { title: "Roof (мансардные)",       columns: roofBase,         electricColumns: roofElectric },
  "zip":                 { title: "ZIP система",             columns: zipBase,          electricColumns: zipElectric },
  "lock":                { title: "LOCK система",            columns: zipBase,          electricColumns: zipElectric },
  "zip-roof":            { title: "ZIP ROOF",                columns: zipBase,          electricColumns: zipElectric },
  "curtain-rails":       { title: "Шторные карнизы",         columns: curtainRailBase,  electricColumns: curtainRailElectric },
  "lift":                { title: "Лифт система",            columns: benthinBase,      electricColumns: benthinElectric },
  "curtains":            { title: "Портьеры",                columns: curtainsBase,     electricColumns: curtainsElectric },
  "plisse":              { title: "Шторы плиссе",            columns: plisseBase,       electricColumns: plisseElectric },
  "plisse-maxi":         { title: "Шторы плиссе MAXI",      columns: plisseBase,       electricColumns: plisseElectric },
  "plisse-rus":          { title: "Шторы плиссе RUS",        columns: plisseBase,       electricColumns: plisseElectric },
};

export function getOrderFormConfig(calcId: string): OrderFormConfig | null {
  return formConfigs[calcId] || null;
}
