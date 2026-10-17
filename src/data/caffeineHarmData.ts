import { ClinicalSource } from '../types';

export interface CaffeineHarmItem {
  id: string;
  systemName: string;
  title: string;
  badgeLabel: string;
  badgeColor: 'rose' | 'amber' | 'cyan' | 'emerald';
  iconType: 'heart' | 'brain' | 'flame' | 'stomach' | 'kidney' | 'dental';
  shortDescription: string;
  clinicalMechanism: string;
  symptoms: string[];
  reversibilityTimeline: string;
  medicalCitation: string;
  sources: ClinicalSource[];
}

export const CAFFEINE_HARM_DATA: CaffeineHarmItem[] = [
  {
    id: 'cardiovascular',
    systemName: 'Сердечно-сосудистая система',
    title: 'Вазоконстрикция и перегрузка миокарда',
    badgeLabel: 'Кардиология',
    badgeColor: 'rose',
    iconType: 'heart',
    shortDescription:
      'Кратковременный подъем артериального давления (на 5–10+ мм рт. ст. в острой фазе), удлинение интервала QTc и спазм коронарных сосудов.',
    clinicalMechanism:
      'Кофеин стимулирует симпатическую нервную систему, блокирует аденозиновые рецепторы и ингибирует фосфодиэстеразу, вызывая накопление цАМФ. В сочетании с таурином и другими компонентами энергетиков в клинических испытаниях зафиксировано статистически значимое удлинение интервала QTc и повышение систолического/диастолического давления, сохраняющееся в течение нескольких часов.',
    symptoms: [
      'Внезапные эпизоды синусовой тахикардии и пульсация в височной области',
      'Ощущение перебоев в работе сердца и одышка при привычной физической нагрузке',
      'Кратковременный подъем артериального давления после употребления напитка',
      'Похолодание дистальных отделов конечностей из-за вазоконстрикции капилляров',
    ],
    reversibilityTimeline:
      'Ориентировочно: гемодинамические показатели стабилизируются в течение 3–7 дней после прекращения регулярного приема (индивидуально, зависит от толерантности).',
    medicalCitation:
      'Journal of the American Heart Association (JAHA, 2019): Randomized Controlled Trial on ECG and Hemodynamic Parameters.',
    sources: [
      {
        title:
          'Impact of High Volume Energy Drink Consumption on Electrocardiographic and Blood Pressure Parameters: A Randomized Trial',
        authors: 'Shah SA, Szeto AH, Farewell R, et al.',
        year: 2019,
        url: 'https://doi.org/10.1161/JAHA.118.011318',
      },
      {
        title:
          'The effect of acute caffeine ingestion on blood pressure in hypertensive individuals: a systematic review and meta-analysis',
        authors: 'Mesas AE, Leon-Muñoz LM, Rodriguez-Artalejo F, Lopez-Garcia E.',
        year: 2011,
        url: 'https://doi.org/10.1038/ejcn.2011.89',
      },
    ],
  },
  {
    id: 'neuro-sleep',
    systemName: 'Нервная система и сон',
    title: 'Блокада аденозина и фрагментация сна',
    badgeLabel: 'Нейробиология',
    badgeColor: 'cyan',
    iconType: 'brain',
    shortDescription:
      'Маскировка физиологической усталости через блокаду A1/A2A рецепторов, удлинение засыпания и сокращение глубокого дельта-сна.',
    clinicalMechanism:
      'Кофеин является неселективным конкурентным антагонистом аденозиновых рецепторов A1 и A2A. Он не генерирует энергию, а временно блокирует связывание эндогенного аденозина — сигнальной молекулы сомногенного давления. При регулярном приеме мозг компенсирует блокаду увеличением плотности рецепторов (up-regulation), формируя выраженную толерантность и синдром отмены при пропуске дозы.',
    symptoms: [
      'Удлинение латентного периода засыпания и частые ночные пробуждения',
      'Снижение продолжительности глубокого медленноволнового сна (NREM) и REM-фазы',
      'Дневная сонливость, «мозговой туман» и раздражительность при отсутствии стимулятора',
      'Пульсирующая головная боль отмены, достигающая пика на 20–51 час воздержания',
    ],
    reversibilityTimeline:
      'Ориентировочно: острые симптомы отмены стихают за 2–9 дней (пик 20–51 ч); чувствительность рецепторного пула нормализуется в течение 1–2 недель.',
    medicalCitation:
      'Sleep Medicine Reviews (2017) & Psychopharmacology (2004): Systematic review on sleep architecture and caffeine withdrawal validation.',
    sources: [
      {
        title:
          'A critical review of caffeine withdrawal: empirical validation of symptoms and signs, incidence, severity, and associated features',
        authors: 'Juliano LM, Griffiths RR.',
        year: 2004,
        url: 'https://doi.org/10.1007/s00213-004-1815-3',
      },
      {
        title:
          'Coffee, caffeine, and sleep: A systematic review of epidemiological studies and randomized controlled trials',
        authors: 'Clark I, Landolt HP.',
        year: 2017,
        url: 'https://doi.org/10.1016/j.smrv.2016.01.006',
      },
      {
        title:
          'Actions of caffeine in the brain with special reference to factors that contribute to its widespread use',
        authors: 'Fredholm BB, Bättig K, Holmén J, Nehlig A, Zvartau EE.',
        year: 1999,
        url: 'https://pubmed.ncbi.nlm.nih.gov/10049999/',
      },
    ],
  },
  {
    id: 'adrenals-cortisol',
    systemName: 'Эндокринная система',
    title: 'Стимуляция HPA-оси и подъем кортизола',
    badgeLabel: 'Эндокринология',
    badgeColor: 'amber',
    iconType: 'flame',
    shortDescription:
      'Активация симпатоадреналовой системы и секреции кортизола с формированием частичной толерантности при регулярном приеме.',
    clinicalMechanism:
      'Кофеин стимулирует гипоталамо-гипофизарно-надпочечниковую ось (HPA-axis), вызывая подъем уровня адреналина и кортизола в плазме. При ежедневном потреблении развивается толерантность к утренней дозе, однако повторные приемы в течение дня продолжают стимулировать выработку гормонов стресса. В доказательной медицине речь идет о временном функциональном сдвиге циркадного ритма секреции.',
    symptoms: [
      'Эмоциональные качели и повышенная тревожность на фоне действия стимулятора',
      'Смещение пика бодрости на вечерние часы с подавлением физиологической сонливости',
      'Усиленная тяга к высококалорийной углеводной пище на спаде концентрации стимулятора',
      'Субъективное чувство внутреннего напряжения при решении рутинных задач',
    ],
    reversibilityTimeline:
      'Ориентировочно: базальный суточный профиль кортизола нормализуется в течение 1–3 недель после отмены стимуляторов (индивидуально).',
    medicalCitation:
      'Psychosomatic Medicine (2005): Caffeine stimulation of cortisol secretion across waking hours in relation to intake levels.',
    sources: [
      {
        title:
          'Caffeine stimulation of cortisol secretion across the waking hours in relation to caffeine intake levels',
        authors: "Lovallo WR, Whitsett TL, al'Absi M, et al.",
        year: 2005,
        url: 'https://doi.org/10.1097/01.psy.0000181270.20036.06',
      },
    ],
  },
  {
    id: 'gastrointestinal',
    systemName: 'ЖКТ и пищеварение',
    title: 'Гастроэзофагеальный рефлюкс и гиперсекреция кислоты',
    badgeLabel: 'Гастроэнтерология',
    badgeColor: 'rose',
    iconType: 'stomach',
    shortDescription:
      'Стимуляция секреции соляной кислоты и транзиторное расслабление нижнего пищеводного сфинктера.',
    clinicalMechanism:
      'Кофеин и органические кислоты (лимонная, ортофосфорная) стимулируют париетальные клетки желудка напрямую вырабатывать соляную кислоту и пепсин. Параллельно кофеин снижает базальный тонус нижнего пищеводного сфинктера (LES), провоцируя гастроэзофагеальный рефлюкс и контактное раздражение слизистой оболочки пищевода.',
    symptoms: [
      'Жжение за грудиной (изжога) и кислая отрыжка вскоре после приема напитка',
      'Дискомфорт и ноющие спазмы в эпигастральной области, особенно при приеме натощак',
      'Тошнота и усиление перистальтики кишечника вследствие стимулирующего действия',
      'Раздражение слизистых оболочек при регулярном контакте с кислыми растворами',
    ],
    reversibilityTimeline:
      'Ориентировочно: симптомы кислотозависимого раздражения слизистой стихают через 5–7 дней после исключения напитка.',
    medicalCitation:
      'Scandinavian Journal of Gastroenterology (1999): Coffee and gastrointestinal function: facts and fiction review.',
    sources: [
      {
        title: 'Coffee and gastrointestinal function: facts and fiction. A review',
        authors: 'Boekema PJ, Samsom M, van Berge Henegouwen GP, Smout AJ.',
        year: 1999,
        url: 'https://doi.org/10.1080/003655299750025525',
      },
    ],
  },
  {
    id: 'renal-electrolytes',
    systemName: 'Почки и электролиты',
    title: 'Острый диуретический эффект при высоких дозах',
    badgeLabel: 'Нефрология',
    badgeColor: 'cyan',
    iconType: 'kidney',
    shortDescription:
      'Кратковременное усиление диуреза и экскреции электролитов при дозах >250–300 мг с развитием толерантности при регулярном приеме.',
    clinicalMechanism:
      'В дозах свыше 250–300 мг кофеин проявляет умеренное натрийуретическое и диуретическое действие за счет угнетения реабсорбции электролитов в проксимальных канальцах нефрона. У регулярных потребителей к диуретическому эффекту быстро развивается толерантность; при этом хронического обезвоживания не наступает, однако разовые сверхвысокие дозы вызывают учащенное мочеиспускание и временную потерю жидкости.',
    symptoms: [
      'Учащенные позывы к мочеиспусканию в первые 2–3 часа после употребления напитка',
      'Ощущение жажды и сухости во рту при недостаточном употреблении чистой воды',
      'Кратковременные мышечные подергивания при нарушении электролитного баланса',
      'Легкая головная боль напряжения на фоне относительного дефицита жидкости',
    ],
    reversibilityTimeline:
      'Ориентировочно: водный и электролитный баланс нормализуются в первые 24–48 часов при достаточном питьевом режиме.',
    medicalCitation:
      'Journal of Human Nutrition and Dietetics (2003): Caffeine ingestion and fluid balance: a systematic review.',
    sources: [
      {
        title: 'Caffeine ingestion and fluid balance: a review',
        authors: 'Maughan RJ, Griffin J.',
        year: 2003,
        url: 'https://doi.org/10.1046/j.1365-277x.2003.00471.x',
      },
    ],
  },
  {
    id: 'dental-acidity',
    systemName: 'Зубы и ротовая полость',
    title: 'Кислотная эрозия зубной эмали',
    badgeLabel: 'Стоматология',
    badgeColor: 'emerald',
    iconType: 'dental',
    shortDescription:
      'Низкий pH энергетических напитков (2.5–3.5) приводит к химической деминерализации поверхностных слоев эмали.',
    clinicalMechanism:
      'Большинство энергетиков содержат высокие концентрации лимонной кислоты, снижающей pH в полости рта до 2.5–3.2. Деминерализация гидроксиапатита эмали начинается при критическом уровне pH < 5.5. Экспериментальные исследования подтверждают необратимую потерю минерального слоя зубов уже через несколько дней циклического воздействия напитков.',
    symptoms: [
      'Повышенная чувствительность шеек зубов к температурным и химическим раздражителям',
      'Истончение и появление полупрозрачности режущих краев передних зубов',
      'Повышенный риск пришеечных дефектов эмали в зонах прямого контакта с напитком',
      'Ускоренное пожелтение зубов из-за истончения эмали и просвечивания дентина',
    ],
    reversibilityTimeline:
      'Ориентировочно: химическое травмирование эмали прекращается в первый день отказа; для реминерализации требуется от 3–4 недель (по рекомендации стоматолога).',
    medicalCitation:
      'General Dentistry (2012): In vitro potential of sports and energy drinks to erode dental enamel.',
    sources: [
      {
        title: 'A review of sports and energy drinks: physiological implications and dental health',
        authors: 'Jain P, Hall-May E, Golabek K, et al.',
        year: 2012,
        url: 'https://pubmed.ncbi.nlm.nih.gov/22623455/',
      },
    ],
  },
];
