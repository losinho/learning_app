// Age 5 Hebrew Curriculum: Ministry of Education (Gan Chova)
// Vocabulary, Initial Sounds (צליל פותח), Syllables (הברות), Rhyme (חרוזים), Letter Names (שמות האותיות)
import { shuffle } from '../../engine/random.js';
import { pickOddOneOut } from '../../engine/oddOneOut.js';
import { ENGLISH_VOCABULARY_TOPICS, topicHebrewName } from './english.js';

// syllables: the word split for clapping. null = left out of the syllable game because the count
// is ambiguous for children (initial shva like דְּבוֹרָה, or patah genuva like תַּפּוּחַ).
export const HEBREW_VOCABULARY_BANK = [
  // Animals
  { word: 'כֶּלֶב', sound: 'כֶּלֶב', letter: 'כ', emoji: '🐶', syllables: ['כֶּ', 'לֶב'] },
  { word: 'חָתוּל', sound: 'חָתוּל', letter: 'ח', emoji: '🐱', syllables: ['חָ', 'תוּל'] },
  { word: 'דָּג', sound: 'דָּג', letter: 'ד', emoji: '🐟', syllables: ['דָּג'] },
  { word: 'סוּס', sound: 'סוּס', letter: 'ס', emoji: '🐴', syllables: ['סוּס'] },
  { word: 'קוֹף', sound: 'קוֹף', letter: 'ק', emoji: '🐵', syllables: ['קוֹף'] },
  { word: 'אַרְנָב', sound: 'אַרְנָב', letter: 'א', emoji: '🐰', syllables: ['אַרְ', 'נָב'] },
  { word: 'צָב', sound: 'צָב', letter: 'צ', emoji: '🐢', syllables: ['צָב'] },
  { word: 'דְּבוֹרָה', sound: 'דְּבוֹרָה', letter: 'ד', emoji: '🐝', syllables: null },
  { word: 'פִּיל', sound: 'פִּיל', letter: 'פ', emoji: '🐘', syllables: ['פִּיל'] },
  { word: 'אַרְיֵה', sound: 'אַרְיֵה', letter: 'א', emoji: '🦁', syllables: ['אַרְ', 'יֵה'] },
  { word: 'צִפּוֹר', sound: 'צִפּוֹר', letter: 'צ', emoji: '🐦', syllables: ['צִ', 'פּוֹר'] },
  { word: 'צְפַרְדֵּעַ', sound: 'צְפַרְדֵּעַ', letter: 'צ', emoji: '🐸', syllables: null },
  { word: 'דֹּב', sound: 'דֹּב', letter: 'ד', emoji: '🐻', syllables: ['דֹּב'] },
  { word: 'פַּרְפַּר', sound: 'פַּרְפַּר', letter: 'פ', emoji: '🦋', syllables: ['פַּרְ', 'פַּר'] },
  { word: 'הִיפּוֹפּוֹטָם', sound: 'הִיפּוֹפּוֹטָם', letter: 'ה', emoji: '🦛', syllables: ['הִי', 'פּוֹ', 'פּוֹ', 'טָם'] },
  { word: 'קֶנְגּוּרוּ', sound: 'קֶנְגּוּרוּ', letter: 'ק', emoji: '🦘', syllables: ['קֶנְ', 'גּוּ', 'רוּ'] },
  { word: 'פָּרָה', sound: 'פָּרָה', letter: 'פ', emoji: '🐮', syllables: ['פָּ', 'רָה'] },
  { word: 'כִּבְשָׂה', sound: 'כִּבְשָׂה', letter: 'כ', emoji: '🐑', syllables: ['כִּבְ', 'שָׂה'] },
  { word: 'נָחָשׁ', sound: 'נָחָשׁ', letter: 'נ', emoji: '🐍', syllables: ['נָ', 'חָשׁ'] },
  { word: 'עַכְבָּר', sound: 'עַכְבָּר', letter: 'ע', emoji: '🐭', syllables: ['עַכְ', 'בָּר'] },
  { word: 'גָּמָל', sound: 'גָּמָל', letter: 'ג', emoji: '🐫', syllables: ['גָּ', 'מָל'] },
  { word: 'זְאֵב', sound: 'זְאֵב', letter: 'ז', emoji: '🐺', syllables: null },
  { word: 'שׁוּעָל', sound: 'שׁוּעָל', letter: 'ש', emoji: '🦊', syllables: ['שׁוּ', 'עָל'] },
  { word: 'יַנְשׁוּף', sound: 'יַנְשׁוּף', letter: 'י', emoji: '🦉', syllables: ['יַנְ', 'שׁוּף'] },
  { word: 'נָמֵר', sound: 'נָמֵר', letter: 'נ', emoji: '🐯', syllables: ['נָ', 'מֵר'] },
  { word: 'זֶבְּרָה', sound: 'זֶבְּרָה', letter: 'ז', emoji: '🦓', syllables: ['זֶבְּ', 'רָה'] },
  { word: 'תַּנִּין', sound: 'תַּנִּין', letter: 'ת', emoji: '🐊', syllables: ['תַּ', 'נִּין'] },
  { word: 'קִפּוֹד', sound: 'קִפּוֹד', letter: 'ק', emoji: '🦔', syllables: ['קִ', 'פּוֹד'] },
  { word: 'עֵז', sound: 'עֵז', letter: 'ע', emoji: '🐐', syllables: ['עֵז'] },
  { word: 'חֲזִיר', sound: 'חֲזִיר', letter: 'ח', emoji: '🐷', syllables: ['חֲ', 'זִיר'] },
  { word: 'בַּרְוָז', sound: 'בַּרְוָז', letter: 'ב', emoji: '🦆', syllables: ['בַּרְ', 'וָז'] },
  { word: 'תַּרְנְגוֹלֶת', sound: 'תַּרְנְגוֹלֶת', letter: 'ת', emoji: '🐔', syllables: null },
  { word: 'פַּנְדָּה', sound: 'פַּנְדָּה', letter: 'פ', emoji: '🐼', syllables: ['פַּנְ', 'דָּה'] },
  { word: 'דִּינוֹזָאוּר', sound: 'דִּינוֹזָאוּר', letter: 'ד', emoji: '🦖', syllables: ['דִּי', 'נוֹ', 'זָ', 'אוּר'] },
  { word: 'נְמָלָה', sound: 'נְמָלָה', letter: 'נ', emoji: '🐜', syllables: null },
  { word: 'חִלָּזוֹן', sound: 'חִלָּזוֹן', letter: 'ח', emoji: '🐌', syllables: ['חִ', 'לָּ', 'זוֹן'] },
  { word: 'דּוֹלְפִין', sound: 'דּוֹלְפִין', letter: 'ד', emoji: '🐬', syllables: ['דּוֹלְ', 'פִין'] },
  { word: 'כָּרִישׁ', sound: 'כָּרִישׁ', letter: 'כ', emoji: '🦈', syllables: ['כָּ', 'רִישׁ'] },
  { word: 'לִוְיָתָן', sound: 'לִוְיָתָן', letter: 'ל', emoji: '🐳', syllables: ['לִוְ', 'יָ', 'תָן'] },
  { word: 'תְּמָנוּן', sound: 'תְּמָנוּן', letter: 'ת', emoji: '🐙', syllables: null },
  { word: 'סַרְטָן', sound: 'סַרְטָן', letter: 'ס', emoji: '🦀', syllables: ['סַרְ', 'טָן'] },

  // Objects & Transport
  { word: 'בַּיִת', sound: 'בַּיִת', letter: 'ב', emoji: '🏡', syllables: ['בַּ', 'יִת'] },
  { word: 'מְכוֹנִית', sound: 'מְכוֹנִית', letter: 'מ', emoji: '🚗', syllables: null },
  { word: 'סֵפֶר', sound: 'סֵפֶר', letter: 'ס', emoji: '📖', syllables: ['סֵ', 'פֶר'] },
  { word: 'שָׁעוֹן', sound: 'שָׁעוֹן', letter: 'ש', emoji: '⏰', syllables: ['שָׁ', 'עוֹן'] },
  { word: 'כַּדּוּר', sound: 'כַּדּוּר', letter: 'כ', emoji: '⚽', syllables: ['כַּ', 'דּוּר'] },
  { word: 'בַּלּוֹן', sound: 'בַּלּוֹן', letter: 'ב', emoji: '🎈', syllables: ['בַּ', 'לּוֹן'] },
  { word: 'רַכֶּבֶת', sound: 'רַכֶּבֶת', letter: 'ר', emoji: '🚂', syllables: ['רַ', 'כֶּ', 'בֶת'] },
  { word: 'מַטּוֹס', sound: 'מַטּוֹס', letter: 'מ', emoji: '✈️', syllables: ['מַ', 'טּוֹס'] },
  { word: 'סִירָה', sound: 'סִירָה', letter: 'ס', emoji: '⛵', syllables: ['סִי', 'רָה'] },
  { word: 'נֵר', sound: 'נֵר', letter: 'נ', emoji: '🕯️', syllables: ['נֵר'] },
  { word: 'גִּיטָרָה', sound: 'גִּיטָרָה', letter: 'ג', emoji: '🎸', syllables: ['גִּי', 'טָ', 'רָה'] },
  { word: 'אוֹטוֹבּוּס', sound: 'אוֹטוֹבּוּס', letter: 'א', emoji: '🚌', syllables: ['אוֹ', 'טוֹ', 'בּוּס'] },
  { word: 'טֶלֶוִיזְיָה', sound: 'טֶלֶוִיזְיָה', letter: 'ט', emoji: '📺', syllables: ['טֶ', 'לֶ', 'וִיזְ', 'יָה'] },
  { word: 'כִּסֵּא', sound: 'כִּסֵּא', letter: 'כ', emoji: '🪑', syllables: ['כִּ', 'סֵּא'] },
  { word: 'מִטָּה', sound: 'מִטָּה', letter: 'מ', emoji: '🛏️', syllables: ['מִ', 'טָּה'] },
  { word: 'דֶּלֶת', sound: 'דֶּלֶת', letter: 'ד', emoji: '🚪', syllables: ['דֶּ', 'לֶת'] },
  { word: 'תִּיק', sound: 'תִּיק', letter: 'ת', emoji: '🎒', syllables: ['תִּיק'] },
  { word: 'עִפָּרוֹן', sound: 'עִפָּרוֹן', letter: 'ע', emoji: '✏️', syllables: ['עִ', 'פָּ', 'רוֹן'] },
  { word: 'כַּפִּית', sound: 'כַּפִּית', letter: 'כ', emoji: '🥄', syllables: ['כַּ', 'פִּית'] },
  { word: 'מַתָּנָה', sound: 'מַתָּנָה', letter: 'מ', emoji: '🎁', syllables: ['מַ', 'תָּ', 'נָה'] },
  { word: 'תֹּף', sound: 'תֹּף', letter: 'ת', emoji: '🥁', syllables: ['תֹּף'] },
  { word: 'טֶלֶפוֹן', sound: 'טֶלֶפוֹן', letter: 'ט', emoji: '📱', syllables: ['טֶ', 'לֶ', 'פוֹן'] },
  { word: 'מַטְרִיָּה', sound: 'מַטְרִיָּה', letter: 'מ', emoji: '☂️', syllables: ['מַטְ', 'רִ', 'יָּה'] },
  { word: 'מַפְתֵּחַ', sound: 'מַפְתֵּחַ', letter: 'מ', emoji: '🔑', syllables: null },
  { word: 'כֶּתֶר', sound: 'כֶּתֶר', letter: 'כ', emoji: '👑', syllables: ['כֶּ', 'תֶר'] },
  { word: 'חֻלְצָה', sound: 'חֻלְצָה', letter: 'ח', emoji: '👕', syllables: ['חֻלְ', 'צָה'] },
  { word: 'כּוֹבַע', sound: 'כּוֹבַע', letter: 'כ', emoji: '🧢', syllables: null },
  { word: 'רוֹבּוֹט', sound: 'רוֹבּוֹט', letter: 'ר', emoji: '🤖', syllables: ['רוֹ', 'בּוֹט'] },
  { word: 'עֲפִיפוֹן', sound: 'עֲפִיפוֹן', letter: 'ע', emoji: '🪁', syllables: ['עֲ', 'פִי', 'פוֹן'] },
  { word: 'מַשָּׂאִית', sound: 'מַשָּׂאִית', letter: 'מ', emoji: '🚚', syllables: ['מַ', 'שָּׂ', 'אִית'] },
  { word: 'מַסּוֹק', sound: 'מַסּוֹק', letter: 'מ', emoji: '🚁', syllables: ['מַ', 'סּוֹק'] },
  { word: 'טִיל', sound: 'טִיל', letter: 'ט', emoji: '🚀', syllables: ['טִיל'] },
  { word: 'מוֹנִית', sound: 'מוֹנִית', letter: 'מ', emoji: '🚕', syllables: ['מוֹ', 'נִית'] },
  { word: 'אוֹפַנַּיִם', sound: 'אוֹפַנַּיִם', letter: 'א', emoji: '🚲', syllables: null },

  // Food & Fruits
  { word: 'תַּפּוּחַ', sound: 'תַּפּוּחַ', letter: 'ת', emoji: '🍎', syllables: null },
  { word: 'בָּנָנָה', sound: 'בָּנָנָה', letter: 'ב', emoji: '🍌', syllables: ['בָּ', 'נָ', 'נָה'] },
  { word: 'תּוּת', sound: 'תּוּת', letter: 'ת', emoji: '🍓', syllables: ['תּוּת'] },
  { word: 'עֲנָבִים', sound: 'עֲנָבִים', letter: 'ע', emoji: '🍇', syllables: ['עֲ', 'נָ', 'בִים'] },
  { word: 'גְּלִידָה', sound: 'גְּלִידָה', letter: 'ג', emoji: '🍦', syllables: null },
  { word: 'לֶחֶם', sound: 'לֶחֶם', letter: 'ל', emoji: '🍞', syllables: ['לֶ', 'חֶם'] },
  { word: 'עֻגָּה', sound: 'עֻגָּה', letter: 'ע', emoji: '🎂', syllables: ['עֻ', 'גָּה'] },
  { word: 'שׁוֹקוֹלָד', sound: 'שׁוֹקוֹלָד', letter: 'ש', emoji: '🍫', syllables: ['שׁוֹ', 'קוֹ', 'לָד'] },
  { word: 'בֵּיצָה', sound: 'בֵּיצָה', letter: 'ב', emoji: '🥚', syllables: ['בֵּי', 'צָה'] },
  { word: 'פִּיצָה', sound: 'פִּיצָה', letter: 'פ', emoji: '🍕', syllables: ['פִּי', 'צָה'] },
  { word: 'גֶּזֶר', sound: 'גֶּזֶר', letter: 'ג', emoji: '🥕', syllables: ['גֶּ', 'זֶר'] },
  { word: 'תִּירָס', sound: 'תִּירָס', letter: 'ת', emoji: '🌽', syllables: ['תִּי', 'רָס'] },
  { word: 'לִימוֹן', sound: 'לִימוֹן', letter: 'ל', emoji: '🍋', syllables: ['לִי', 'מוֹן'] },
  { word: 'אַגָּס', sound: 'אַגָּס', letter: 'א', emoji: '🍐', syllables: ['אַ', 'גָּס'] },
  { word: 'עוּגִיָּה', sound: 'עוּגִיָּה', letter: 'ע', emoji: '🍪', syllables: ['עוּ', 'גִ', 'יָּה'] },
  { word: 'אֹרֶז', sound: 'אֹרֶז', letter: 'א', emoji: '🍚', syllables: ['אֹ', 'רֶז'] },
  { word: 'סֻכָּרִיָּה', sound: 'סֻכָּרִיָּה', letter: 'ס', emoji: '🍬', syllables: ['סֻ', 'כָּ', 'רִ', 'יָּה'] },
  { word: 'בָּצָל', sound: 'בָּצָל', letter: 'ב', emoji: '🧅', syllables: ['בָּ', 'צָל'] },
  { word: 'פִּטְרִיָּה', sound: 'פִּטְרִיָּה', letter: 'פ', emoji: '🍄', syllables: ['פִּטְ', 'רִ', 'יָּה'] },
  { word: 'חָלָב', sound: 'חָלָב', letter: 'ח', emoji: '🥛', syllables: ['חָ', 'לָב'] },
  { word: 'גְּבִינָה', sound: 'גְּבִינָה', letter: 'ג', emoji: '🧀', syllables: null },
  { word: 'אֲבַטִּיחַ', sound: 'אֲבַטִּיחַ', letter: 'א', emoji: '🍉', syllables: null },

  // Nature
  { word: 'שֶׁמֶשׁ', sound: 'שֶׁמֶשׁ', letter: 'ש', emoji: '☀️', syllables: ['שֶׁ', 'מֶשׁ'] },
  { word: 'יָרֵחַ', sound: 'יָרֵחַ', letter: 'י', emoji: '🌙', syllables: null },
  { word: 'כּוֹכָב', sound: 'כּוֹכָב', letter: 'כ', emoji: '⭐', syllables: ['כּוֹ', 'כָב'] },
  { word: 'עֵץ', sound: 'עֵץ', letter: 'ע', emoji: '🌳', syllables: ['עֵץ'] },
  { word: 'פֶּרַח', sound: 'פֶּרַח', letter: 'פ', emoji: '🌸', syllables: ['פֶּ', 'רַח'] },
  { word: 'עָנָן', sound: 'עָנָן', letter: 'ע', emoji: '☁️', syllables: ['עָ', 'נָן'] },
  { word: 'קֶשֶׁת', sound: 'קֶשֶׁת', letter: 'ק', emoji: '🌈', syllables: ['קֶ', 'שֶׁת'] },
  { word: 'לֵב', sound: 'לֵב', letter: 'ל', emoji: '❤️', syllables: ['לֵב'] },
  { word: 'יָם', sound: 'יָם', letter: 'י', emoji: '🌊', syllables: ['יָם'] },
  { word: 'הַר', sound: 'הַר', letter: 'ה', emoji: '⛰️', syllables: ['הַר'] },
  { word: 'אֵשׁ', sound: 'אֵשׁ', letter: 'א', emoji: '🔥', syllables: ['אֵשׁ'] },
  { word: 'שֶׁלֶג', sound: 'שֶׁלֶג', letter: 'ש', emoji: '❄️', syllables: ['שֶׁ', 'לֶג'] },
  { word: 'גֶּשֶׁם', sound: 'גֶּשֶׁם', letter: 'ג', emoji: '🌧️', syllables: ['גֶּ', 'שֶׁם'] },
  { word: 'עָלֶה', sound: 'עָלֶה', letter: 'ע', emoji: '🍁', syllables: ['עָ', 'לֶה'] },

  // Body
  { word: 'עַיִן', sound: 'עַיִן', letter: 'ע', emoji: '👁️', syllables: ['עַ', 'יִן'] },
  { word: 'אֹזֶן', sound: 'אֹזֶן', letter: 'א', emoji: '👂', syllables: ['אֹ', 'זֶן'] },
  { word: 'אַף', sound: 'אַף', letter: 'א', emoji: '👃', syllables: ['אַף'] },
  { word: 'שֵׁן', sound: 'שֵׁן', letter: 'ש', emoji: '🦷', syllables: ['שֵׁן'] },
  { word: 'יָד', sound: 'יָד', letter: 'י', emoji: '✋', syllables: ['יָד'] },
  { word: 'רֶגֶל', sound: 'רֶגֶל', letter: 'ר', emoji: '🦵', syllables: ['רֶ', 'גֶל'] },

  // Family
  { word: 'אִמָּא', sound: 'אִמָּא', letter: 'א', emoji: '👩', syllables: ['אִ', 'מָּא'] },
  { word: 'אַבָּא', sound: 'אַבָּא', letter: 'א', emoji: '👨', syllables: ['אַ', 'בָּא'] },
  { word: 'תִּינוֹק', sound: 'תִּינוֹק', letter: 'ת', emoji: '👶', syllables: ['תִּי', 'נוֹק'] },
  { word: 'סָבָא', sound: 'סָבָא', letter: 'ס', emoji: '👴', syllables: ['סָ', 'בָא'] },
  { word: 'סָבְתָא', sound: 'סָבְתָא', letter: 'ס', emoji: '👵', syllables: ['סָבְ', 'תָא'] },
  { word: 'יֶלֶד', sound: 'יֶלֶד', letter: 'י', emoji: '👦', syllables: ['יֶ', 'לֶד'] },
  { word: 'יַלְדָּה', sound: 'יַלְדָּה', letter: 'י', emoji: '👧', syllables: ['יַלְ', 'דָּה'] }
];

// Plurals for the singular/plural game, keyed by the word bank's singular. Irregular plurals
// (בַּיִת → בָּתִּים, נֵר → נֵרוֹת, דְּבוֹרָה → דְּבוֹרִים) are included on purpose — gan children are learning them.
export const HEBREW_PLURALS = {
  'כֶּלֶב': 'כְּלָבִים', 'חָתוּל': 'חֲתוּלִים', 'דָּג': 'דָּגִים', 'סוּס': 'סוּסִים', 'קוֹף': 'קוֹפִים',
  'אַרְנָב': 'אַרְנָבִים', 'צָב': 'צַבִּים', 'פִּיל': 'פִּילִים', 'צִפּוֹר': 'צִפֳּרִים', 'דֹּב': 'דֻּבִּים',
  'פַּרְפַּר': 'פַּרְפָּרִים', 'דְּבוֹרָה': 'דְּבוֹרִים', 'בַּיִת': 'בָּתִּים', 'סֵפֶר': 'סְפָרִים',
  'שָׁעוֹן': 'שְׁעוֹנִים', 'כַּדּוּר': 'כַּדּוּרִים', 'בַּלּוֹן': 'בַּלּוֹנִים', 'מְכוֹנִית': 'מְכוֹנִיּוֹת',
  'סִירָה': 'סִירוֹת', 'נֵר': 'נֵרוֹת', 'תַּפּוּחַ': 'תַּפּוּחִים', 'בָּנָנָה': 'בָּנָנוֹת', 'תּוּת': 'תּוּתִים',
  'עֻגָּה': 'עוּגוֹת', 'גְּלִידָה': 'גְּלִידוֹת', 'כּוֹכָב': 'כּוֹכָבִים', 'עֵץ': 'עֵצִים', 'פֶּרַח': 'פְּרָחִים',
  'עָנָן': 'עֲנָנִים',
  'פָּרָה': 'פָּרוֹת', 'כִּבְשָׂה': 'כְּבָשׂוֹת', 'נָחָשׁ': 'נְחָשִׁים', 'עַכְבָּר': 'עַכְבָּרִים', 'גָּמָל': 'גְּמַלִּים',
  'זְאֵב': 'זְאֵבִים', 'שׁוּעָל': 'שׁוּעָלִים', 'יַנְשׁוּף': 'יַנְשׁוּפִים', 'נָמֵר': 'נְמֵרִים', 'תַּנִּין': 'תַּנִּינִים',
  'קִפּוֹד': 'קִפּוֹדִים', 'כָּרִישׁ': 'כְּרִישִׁים', 'נְמָלָה': 'נְמָלִים', 'סַרְטָן': 'סַרְטָנִים', 'עֵז': 'עִזִּים',
  'בַּרְוָז': 'בַּרְוָזִים', 'חֲזִיר': 'חֲזִירִים', 'כִּסֵּא': 'כִּסְאוֹת', 'מִטָּה': 'מִטּוֹת', 'דֶּלֶת': 'דְּלָתוֹת',
  'תִּיק': 'תִּיקִים', 'כַּפִּית': 'כַּפִּיּוֹת', 'מַתָּנָה': 'מַתָּנוֹת', 'כֶּתֶר': 'כְּתָרִים', 'חֻלְצָה': 'חֻלְצוֹת',
  'מַפְתֵּחַ': 'מַפְתְּחוֹת', 'מַשָּׂאִית': 'מַשָּׂאִיּוֹת', 'טִיל': 'טִילִים', 'מוֹנִית': 'מוֹנִיּוֹת', 'בֵּיצָה': 'בֵּיצִים',
  'גֶּזֶר': 'גְּזָרִים', 'לִימוֹן': 'לִימוֹנִים', 'אַגָּס': 'אַגָּסִים', 'עוּגִיָּה': 'עוּגִיּוֹת', 'בָּצָל': 'בְּצָלִים',
  'עָלֶה': 'עָלִים', 'הַר': 'הָרִים', 'תִּינוֹק': 'תִּינוֹקוֹת', 'יֶלֶד': 'יְלָדִים', 'יַלְדָּה': 'יְלָדוֹת'
};

// Rhyme families: every word in a family rhymes with the others; words in different families do not.
export const HEBREW_RHYME_FAMILIES = [
  [{ word: 'שָׁעוֹן', emoji: '⏰' }, { word: 'בַּלּוֹן', emoji: '🎈' }, { word: 'עִתּוֹן', emoji: '📰' }, { word: 'עִפָּרוֹן', emoji: '✏️' }],
  [{ word: 'קוֹף', emoji: '🐵' }, { word: 'חוֹף', emoji: '🏖️' }],
  [{ word: 'מְכוֹנִית', emoji: '🚗' }, { word: 'כַּפִּית', emoji: '🥄' }],
  [{ word: 'לֵב', emoji: '❤️' }, { word: 'זְאֵב', emoji: '🐺' }],
  [{ word: 'מַטּוֹס', emoji: '✈️' }, { word: 'כּוֹס', emoji: '🥛' }],
  [{ word: 'יָרֵחַ', emoji: '🌙' }, { word: 'מַפְתֵּחַ', emoji: '🔑' }],
  [{ word: 'סוּס', emoji: '🐴' }, { word: 'אוֹטוֹבּוּס', emoji: '🚌' }],
  [{ word: 'פַּרְפַּר', emoji: '🦋' }, { word: 'עַכְבָּר', emoji: '🐭' }]
];

// The 22 letters (no final forms) with their names for display. The spoken cue uses the bare letter
// ("איפה האות ג?"), which TTS engines read as the letter's name, as the initial-sound game already does.
export const HEBREW_LETTER_NAMES = [
  { letter: 'א', name: 'אָלֶף' }, { letter: 'ב', name: 'בֵּית' }, { letter: 'ג', name: 'גִּימֶל' },
  { letter: 'ד', name: 'דָּלֶת' }, { letter: 'ה', name: 'הֵא' }, { letter: 'ו', name: 'וָו' },
  { letter: 'ז', name: 'זַיִן' }, { letter: 'ח', name: 'חֵית' }, { letter: 'ט', name: 'טֵית' },
  { letter: 'י', name: 'יוֹד' }, { letter: 'כ', name: 'כַּף' }, { letter: 'ל', name: 'לָמֶד' },
  { letter: 'מ', name: 'מֵם' }, { letter: 'נ', name: 'נוּן' }, { letter: 'ס', name: 'סָמֶךְ' },
  { letter: 'ע', name: 'עַיִן' }, { letter: 'פ', name: 'פֵּא' }, { letter: 'צ', name: 'צָדִי' },
  { letter: 'ק', name: 'קוֹף' }, { letter: 'ר', name: 'רֵישׁ' }, { letter: 'ש', name: 'שִׁין' },
  { letter: 'ת', name: 'תָּו' }
];

// Letters young children confuse by shape — one of these is used as a distractor when available
const LOOKALIKE_LETTERS = {
  'ב': ['כ', 'פ'], 'כ': ['ב', 'פ'], 'פ': ['כ', 'ב'],
  'ד': ['ר', 'ה'], 'ר': ['ד', 'ה'], 'ה': ['ח', 'ת'], 'ח': ['ה', 'ת'], 'ת': ['ח', 'ה'],
  'ו': ['ז', 'י'], 'ז': ['ו', 'י'], 'י': ['ו', 'ז'],
  'ס': ['ט', 'מ'], 'ט': ['ס', 'מ'], 'מ': ['ט', 'ס'],
  'ע': ['צ'], 'צ': ['ע'], 'ג': ['נ'], 'נ': ['ג', 'כ'], 'ק': ['ה', 'ר']
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate dynamic word-to-picture exercise
export function generateDynamicWordMatch() {
  const target = pickRandom(HEBREW_VOCABULARY_BANK);
  const distractors = HEBREW_VOCABULARY_BANK.filter(item => item.word !== target.word);
  const shuffledDistractors = shuffle(distractors).slice(0, 2);

  const options = shuffle([
    { id: target.word, emoji: target.emoji },
    { id: shuffledDistractors[0].word, emoji: shuffledDistractors[0].emoji },
    { id: shuffledDistractors[1].word, emoji: shuffledDistractors[1].emoji }
  ]);

  return {
    id: 'heb_dyn_word_' + Date.now() + '_' + Math.random(),
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    title: 'מילים ותמונות',
    instructionHebrew: 'קראו את המילה ובחרו את התמונה המתאימה:',
    targetWordVocalized: target.word,
    soundCue: target.sound,
    correctOptionId: target.word,
    options: options
  };
}

// Letters that sound the same at the start of a word (כּ/ק = /k/, א/ע = vowel onset, ת/ט = /t/, ס/שׂ = /s/).
// A child answering by sound must never see two of these as competing options.
const SAME_SOUND_GROUPS = [['כ', 'ק'], ['א', 'ע'], ['ת', 'ט'], ['ס', 'שׂ']];

function soundsAlike(letterA, letterB) {
  return letterA === letterB ||
    SAME_SOUND_GROUPS.some(group => group.includes(letterA) && group.includes(letterB));
}

// Generate dynamic initial sound exercise (צליל פותח)
export function generateDynamicInitialSound() {
  const target = pickRandom(HEBREW_VOCABULARY_BANK);
  // Pick distractors whose first sound differs from the target's
  const distractors = HEBREW_VOCABULARY_BANK.filter(item => !soundsAlike(item.letter, target.letter));
  const shuffledDistractors = shuffle(distractors).slice(0, 2);

  const options = shuffle([
    { id: target.word, emoji: target.emoji },
    { id: shuffledDistractors[0].word, emoji: shuffledDistractors[0].emoji },
    { id: shuffledDistractors[1].word, emoji: shuffledDistractors[1].emoji }
  ]);

  return {
    id: 'heb_dyn_sound_' + Date.now() + '_' + Math.random(),
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    title: 'צליל פותח',
    instructionHebrew: `איזו תמונה מתחילה באות ${target.letter}?`,
    targetWordVocalized: `האות ${target.letter}`,
    soundCue: `איזו תמונה מתחילה באות ${target.letter}?`,
    correctOptionId: target.word,
    options: options
  };
}

// Syllables (הברות): hear/see a word, choose how many claps it has
export function generateSyllableCount() {
  const clappable = HEBREW_VOCABULARY_BANK.filter(item => item.syllables);
  // Pick the count first so every answer comes up often; 4 is rarer because only a few words have 4
  const count = pickRandom([1, 2, 3, 1, 2, 3, 4]);
  const target = pickRandom(clappable.filter(item => item.syllables.length === count));

  // 3 consecutive choices that include the answer, in ascending order (like a number line)
  const first = count <= 2 ? 1 : 2;
  const options = [first, first + 1, first + 2].map(n => ({
    id: String(n),
    emoji: String(n),
    label: '👏'.repeat(n)
  }));

  return {
    id: `heb_5_syll_${target.word}`,
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'הברות',
    instructionHebrew: 'מחאו כפיים לכל הברה במילה. כמה הברות יש במילה?',
    targetWordVocalized: `${target.emoji} ${target.word}`,
    soundCue: target.sound,
    correctOptionId: String(count),
    feedbackNote: `${target.syllables.join(' – ')}  ${'👏'.repeat(count)}`,
    options
  };
}

// Rhyme (חרוזים): which picture rhymes with the target word?
export function generateRhymeMatch() {
  const family = pickRandom(HEBREW_RHYME_FAMILIES);
  const [target, rhyme] = shuffle(family);
  const otherFamilies = shuffle(HEBREW_RHYME_FAMILIES.filter(f => f !== family)).slice(0, 2);
  const distractors = otherFamilies.map(f => pickRandom(f.filter(w => w.emoji !== target.emoji)));

  const options = shuffle([rhyme, ...distractors]).map(w => ({ id: w.word, emoji: w.emoji, label: w.word }));

  return {
    id: `heb_5_rhyme_${target.word}`,
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'חרוזים',
    instructionHebrew: `איזו מילה מתחרזת עם המילה ${target.word}?`,
    targetWordVocalized: `${target.emoji} ${target.word}`,
    soundCue: target.word,
    correctOptionId: rhyme.word,
    feedbackNote: `${target.word} – ${rhyme.word}`,
    options
  };
}

// Letter names (שמות האותיות): hear a letter's name, find the letter
export function generateLetterName() {
  const target = pickRandom(HEBREW_LETTER_NAMES);
  const lookalike = pickRandom(LOOKALIKE_LETTERS[target.letter] || []);
  const others = shuffle(HEBREW_LETTER_NAMES.map(l => l.letter).filter(l => l !== target.letter && l !== lookalike));
  const distractors = lookalike ? [lookalike, others[0]] : others.slice(0, 2);

  const options = shuffle([target.letter, ...distractors]).map(l => ({ id: l, emoji: l }));

  return {
    id: `heb_5_letter_${target.letter}`,
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    title: 'שמות האותיות',
    instructionHebrew: `איפה האות ${target.name}?`,
    targetWordVocalized: `האות ${target.name}`,
    soundCue: `איפה האות ${target.letter}?`,
    correctOptionId: target.letter,
    feedbackNote: `${target.letter} = ${target.name}`,
    options
  };
}

// Final sound (צליל סוגר) — final letter forms count as their base letter (ן = נ)
const FINAL_FORMS = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
// Words ending in these letters end in a vowel sound, so they are never the target
const VOWEL_ENDINGS = ['ה', 'ו', 'א', 'ע', 'י'];
// At the end of a word, כ without dagesh sounds like ח and ב without dagesh like ו
const FINAL_SAME_SOUND_GROUPS = [...SAME_SOUND_GROUPS, ['ח', 'כ'], ['ב', 'ו']];

function lastLetter(word) {
  const bare = word.replace(/[֑-ׇ]/g, '');
  return bare[bare.length - 1];
}

function baseLetter(letter) {
  return FINAL_FORMS[letter] || letter;
}

function endsAlike(letterA, letterB) {
  const a = baseLetter(letterA);
  const b = baseLetter(letterB);
  return a === b || FINAL_SAME_SOUND_GROUPS.some(group => group.includes(a) && group.includes(b));
}

// "איזו תמונה מסתיימת באות ל?"
export function generateFinalSound() {
  const pool = HEBREW_VOCABULARY_BANK.filter(item => !VOWEL_ENDINGS.includes(baseLetter(lastLetter(item.word))));
  const target = pickRandom(pool);
  const finalChar = lastLetter(target.word);
  const distractors = shuffle(HEBREW_VOCABULARY_BANK.filter(item => !endsAlike(lastLetter(item.word), finalChar))).slice(0, 2);

  const options = shuffle([target, ...distractors]).map(item => ({ id: item.word, emoji: item.emoji }));

  return {
    id: `heb_5_final_${target.word}`,
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    title: 'צליל סוגר',
    instructionHebrew: `איזו תמונה מסתיימת באות ${finalChar}?`,
    targetWordVocalized: `האות ${finalChar}`,
    soundCue: `איזו תמונה מסתיימת באות ${baseLetter(finalChar)}?`,
    correctOptionId: target.word,
    feedbackNote: `${target.emoji} ${target.word}`,
    options
  };
}

// Singular/plural (יחיד ורבים): hear "כְּלָבִים" → pick the picture with many dogs (or "כֶּלֶב" → one dog)
export function generatePluralMatch() {
  const pool = HEBREW_VOCABULARY_BANK.filter(item => HEBREW_PLURALS[item.word]);
  const target = pickRandom(pool);
  const other = pickRandom(pool.filter(item => item.word !== target.word));
  const plural = HEBREW_PLURALS[target.word];
  const askPlural = Math.random() < 0.5;

  const one = item => ({ id: `one_${item.word}`, emoji: item.emoji });
  const many = item => ({ id: `many_${item.word}`, emoji: `<span style="font-size:0.45em">${item.emoji.repeat(3)}</span>` });
  // Always one and many of the target, plus the other animal/object in the asked number
  const options = shuffle([one(target), many(target), askPlural ? many(other) : one(other)]);
  const word = askPlural ? plural : target.word;

  return {
    id: `heb_5_plural_${word}`,
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    title: 'יחיד ורבים',
    instructionHebrew: `באיזו תמונה יש ${word}?`,
    targetWordVocalized: word,
    soundCue: word,
    correctOptionId: askPlural ? `many_${target.word}` : `one_${target.word}`,
    feedbackNote: `${target.emoji} ${target.word} – ${target.emoji.repeat(3)} ${plural}`,
    options
  };
}

// The Hebrew bank grouped into the English bank's topics by picture (🐶 → animals); words whose picture
// is not in the English bank are left out of these groups
const TOPIC_BY_EMOJI = new Map(Object.entries(ENGLISH_VOCABULARY_TOPICS)
  .flatMap(([key, topic]) => topic.words.map(w => [w.emoji, key])));
const HEBREW_TOPICS = {};
for (const item of HEBREW_VOCABULARY_BANK) {
  const key = TOPIC_BY_EMOJI.get(item.emoji);
  if (key) (HEBREW_TOPICS[key] ||= { words: [] }).words.push(item);
}

// Odd one out (מה לא שייך? — sorting into groups): 3 pictures of one kind + 1 that doesn't belong
export function generateHebrewOddOneOut() {
  const { groupKey, group, odd } = pickOddOneOut(HEBREW_TOPICS);
  return {
    id: `heb_5_odd_${odd.word}`,
    ageGroup: '5',
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'מה לא שייך?',
    instructionHebrew: 'שלוש תמונות שייכות לאותה קבוצה. איזו תמונה לא שייכת?',
    targetWordVocalized: '<span style="font-size:0.55em;white-space:nowrap">מה לא שייך? 🤔</span>',
    soundCue: 'מה לא שייך?',
    correctOptionId: odd.word,
    feedbackNote: `${group.map(w => w.emoji).join(' ')} – ${topicHebrewName(groupKey)}<br>${odd.emoji} ${odd.word} – לא שייך`,
    options: shuffle([...group, odd]).map(w => ({ id: w.word, emoji: w.emoji, label: w.word }))
  };
}

// Generates a fresh round every time the child practices!
// Cycle: word-picture, initial sound, syllables, rhyme, letter names, plural, final sound, odd one out.
// The same question (same type + same target) never appears twice in one round.
export function getHebrewAge5Exercises(count = 20) {
  const generators = [
    generateDynamicWordMatch,
    generateDynamicInitialSound,
    generateSyllableCount,
    generateRhymeMatch,
    generateLetterName,
    generatePluralMatch,
    generateFinalSound,
    generateHebrewOddOneOut
  ];
  // A question = its type + what is shown + its answer (odd-one-out always shows the same banner)
  const keyOf = ex => `${ex.title}|${ex.targetWordVocalized}|${ex.correctOptionId}`;
  const used = new Set();
  const list = [];
  for (let i = 0; i < count; i++) {
    const generate = generators[i % generators.length];
    let ex = generate();
    for (let tries = 0; tries < 30 && used.has(keyOf(ex)); tries++) {
      ex = generate();
    }
    used.add(keyOf(ex));
    list.push(ex);
  }
  return list;
}
