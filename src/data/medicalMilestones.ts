import { BioMilestone } from '../types';

export const MEDICAL_MILESTONES_BASE: Omit<BioMilestone, 'progressPercent' | 'isCompleted'>[] = [
  {
    id: 'detox-blood',
    title: 'Выведение кофеина и таурина из крови',
    durationHours: 24,
    durationLabel: '24 часа',
    shortDescription: 'Фильтрация стимуляторов почками и спад частоты пульса.',
    fullMedicalDescription:
      'Период полувыведения кофеина у взрослого человека составляет в среднем от 3 до 7 часов (обычно 4–5 часов при нормальной функции CYP1A2). Спустя 24 часа концентрация ксантинов в плазме крови снижается до следовых значений. Почки завершают экскрецию водорастворимых метаболитов. Частота сердечных сокращений в покое возвращается к исходному уровню.',
    biochemicalEffect:
      'Снижение симпатоадреналовой активности, падение уровня катехоламинов в плазме, устранение острой вазоконстрикции.',
    currentSymptoms:
      'Возможна выраженная сонливость, вялость, ощущение тупого давления в височной области — манифестация начальной фазы синдрома отмены (обычно начинается через 12–24 часа).',
    category: 'detox',
    sources: [
      {
        title: 'Pharmacology of Caffeine (Institute of Medicine Committee on Military Nutrition Research)',
        authors: 'Institute of Medicine (US)',
        year: 2001,
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK223808/',
      },
      {
        title: 'A critical review of caffeine withdrawal: empirical validation of symptoms and signs, incidence, severity, and associated features',
        authors: 'Juliano LM, Griffiths RR.',
        year: 2004,
        url: 'https://doi.org/10.1007/s00213-004-1815-3',
      },
    ],
  },
  {
    id: 'cardio-vascular',
    title: 'Снятие сосудистого спазма и стабилизация давления',
    durationHours: 96,
    durationLabel: '4 дня',
    shortDescription: 'Нормализация мозгового кровотока и артериального давления.',
    fullMedicalDescription:
      'Острый прием кофеина снижает мозговой кровоток на 18–23% за счет блокады аденозиновых вазодилататорных рецепторов. При отмене возникает реактивная гиперемия (увеличение кровотока до +30%), которая лежит в основе синдрома отмены и головных болей. К 4-му дню церебральный кровоток адаптируется, пик синдрома отмены (20–51 час) преодолевается.',
    biochemicalEffect:
      'Восстановление физиологической регуляции тонуса сосудов эндотелиальным оксидом азота (NO), стабилизация среднего артериального давления.',
    currentSymptoms:
      'Пик головной боли позади. Снижается напряжение в височной зоне, восстанавливается субъективная ясность восприятия.',
    category: 'cardio',
    sources: [
      {
        title: 'Dietary caffeine consumption and withdrawal: confounding variables in quantitative cerebral perfusion studies?',
        authors: 'Field AS, Laurienti PJ, Yen YF, Burdette JH, Moody DM.',
        year: 2003,
        url: 'https://doi.org/10.1148/radiol.2271011986',
      },
      {
        title: 'The effect of acute caffeine ingestion on blood pressure in hypertensive individuals: a systematic review and meta-analysis',
        authors: 'Mesas AE, Leon-Muñoz LM, Rodriguez-Artalejo F, Lopez-Garcia E.',
        year: 2011,
        url: 'https://doi.org/10.1038/ejcn.2011.89',
      },
    ],
  },
  {
    id: 'sleep-hormones',
    title: 'Углубление сна и циркадный ритм',
    durationHours: 168,
    durationLabel: '7 дней',
    shortDescription: 'Восстановление фаз глубокого сна (NREM) и стабилизация кортизола.',
    fullMedicalDescription:
      'Регулярное потребление стимуляторов достоверно сокращает время медленноволнового сна (Delta-NREM) и нарушает консолидацию памяти. Спустя неделю без стимуляции сокращается латентность засыпания, сон становится непрерывным. Постепенно нормализуется циркадный ритм утреннего кортизола без искусственных дневных всплесков.',
    biochemicalEffect:
      'Синхронизация секреции мелатонина эпифизом, восстановление физиологической секреции соматотропного гормона (СТГ) в глубоких фазах сна.',
    currentSymptoms:
      'Облегчение утреннего пробуждения, появление ярких сновидений (компенсаторный rebound REM-фазы), снижение дневной разбитости.',
    category: 'sleep',
    sources: [
      {
        title: 'Coffee, caffeine, and sleep: A systematic review of epidemiological studies and randomized controlled trials',
        authors: 'Clark I, Landolt HP.',
        year: 2017,
        url: 'https://doi.org/10.1016/j.smrv.2016.01.006',
      },
      {
        title: 'Caffeine stimulation of cortisol secretion across the waking hours in relation to caffeine intake levels',
        authors: 'Lovallo WR, Whitsett TL, al\'Absi M, et al.',
        year: 2005,
        url: 'https://doi.org/10.1097/01.psy.0000181270.20036.06',
      },
    ],
  },
  {
    id: 'neuro-adenosine',
    title: 'Нормализация аденозиновых рецепторов',
    durationHours: 336,
    durationLabel: '14 дней',
    shortDescription: 'Даунрегуляция избыточных рецепторов аденозина и естественная бодрость.',
    fullMedicalDescription:
      'Хроническая блокада рецепторов аденозина приводит к компенсаторной ап-регуляции рецепторного пула A1 и A2A в коре и полосатом теле. В течение 1–2 недель после отмены стимуляторов плотность рецепторов возвращается к исходному физиологическому уровню, исчезает феномен толерантности и возвращается чувствительность к собственным ритмам сна и бодрствования.',
    biochemicalEffect:
      'Нормализация плотности пуринергических A1/A2A рецепторов, восстановление чувствительности дофаминовых D2-рецепторов.',
    currentSymptoms:
      'Ровная естественная концентрация внимания в течение дня без потребности во внешних стимуляторах к середине рабочего дня.',
    category: 'neuro',
    sources: [
      {
        title: 'Actions of caffeine in the brain with special reference to factors that contribute to its widespread use',
        authors: 'Fredholm BB, Bättig K, Holmén J, Nehlig A, Zvartau EE.',
        year: 1999,
        url: 'https://pubmed.ncbi.nlm.nih.gov/10049999/',
      },
      {
        title: 'A critical review of caffeine withdrawal: empirical validation of symptoms and signs, incidence, severity, and associated features',
        authors: 'Juliano LM, Griffiths RR.',
        year: 2004,
        url: 'https://doi.org/10.1007/s00213-004-1815-3',
      },
    ],
  },
  {
    id: 'metabolic-liver',
    title: 'Метаболическая стабилизация и ферментный гомеостаз',
    durationHours: 672,
    durationLabel: '28 дней',
    shortDescription: 'Снижение нагрузки на ферменты цитохрома P450 (CYP1A2) и гликемическая стабильность.',
    fullMedicalDescription:
      'Ферментная система печени (CYP1A2) освобождается от постоянного метаболизма ксантинов и сопутствующих добавок. При исключении подслащенных энергетиков снижаются суточные колебания гликемии, улучшается чувствительность тканей к инсулину. Обратите внимание: сроки метаболической перестройки строго ориентировочные и варьируются у разных людей.',
    biochemicalEffect:
      'Снижение экзогенной нагрузки на микросомальное окисление гепатоцитов, нормализация инсулинового отклика на приемы пищи.',
    currentSymptoms:
      'Улучшение общего самочувствия, стабилизация аппетита, отсутствие резких приступов голода на спаде уровня стимулятора.',
    category: 'metabolic',
    sources: [
      {
        title: 'PharmGKB summary: caffeine pathway',
        authors: 'Thorn CF, Aklillu E, McDonagh EM, Klein TE, Altman RB.',
        year: 2012,
        url: 'https://doi.org/10.1097/FPC.0b013e3283505d5e',
      },
      {
        title: 'Sugars intake for adults and children (Guideline)',
        authors: 'World Health Organization (WHO)',
        year: 2015,
        url: 'https://www.who.int/publications/i/item/9789241549028',
      },
    ],
  },
];
