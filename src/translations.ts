export type Language = "uk" | "en" | "ru";

export interface TranslationSchema {
  header: {
    tagline: string;
    indicators: {
      hq: string;
      sector: string;
    };
    tabs: {
      genesis: string;
      album: string;
      forge: string;
      oracle: string;
    };
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    btnAlbum: string;
    btnSynth: string;
  };
  tabsNav: {
    genesis: { label: string; desc: string };
    album: { label: string; desc: string };
    forge: { label: string; desc: string };
    oracle: { label: string; desc: string };
  };
  genesis: {
    badge: string;
    title: string;
    intro: string;
    quote: string;
    timeline: {
      childhood: { year: string; title: string; text: string };
      father: { year: string; title: string; text: string };
      vintage: { year: string; title: string; text: string };
      future: { year: string; title: string; text: string };
    };
  };
  album: {
    badge: string;
    title: string;
    quote: string;
    desc: string;
    motivateTitle: string;
    motivateDesc: string;
  };
  synth: {
    title: string;
    subtitle: string;
    visualizer: string;
    oscillator: string;
    filter: string;
    delay: string;
    keyboardLabel: string;
  };
  oracle: {
    badge: string;
    title: string;
    desc: string;
    form: {
      name: string;
      namePlaceholder: string;
      coord: string;
      coordPlaceholder: string;
      sectorLabel: string;
      prompt: string;
      promptPlaceholder: string;
      submitBtn: string;
      submitLoading: string;
    };
    log: {
      title: string;
      waiting: string;
      coordLabel: string;
      status: string;
      statusReady: string;
      statusActive: string;
    };
  };
  footer: {
    title: string;
    desc: string;
    telemetry: string;
    platforms: string;
    copyright: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  uk: {
    header: {
      tagline: "Квантовий Електронний Вимір",
      indicators: {
        hq: "UA-HQ_КОМПОЗИТОР",
        sector: "КИЇВСЬКИЙ_СЕКТОР",
      },
      tabs: {
        genesis: "Витоки",
        album: "Neon Horizon",
        forge: "Синтезатор",
        oracle: "Квантовий Оракул",
      },
    },
    hero: {
      badge: "Нова Ера Музики: 2026",
      title: "VIZUA NEON HORIZON",
      subtitle: "Я створюю яскравий, інтелектуальний та глибокий електронний звук, що мотивує рухатися тільки вперед. Відкривайте квантові світи, синтезуйте звукові коливання в нашій альтернативній системі та знаходьте справжню гармонію.",
      btnAlbum: "Дослідити Альбом",
      btnSynth: "Запустити Синтезатор",
    },
    tabsNav: {
      genesis: { label: "Витоки & Спадщина", desc: "Родина, Україна, DJ Шлях" },
      album: { label: "Альбом Neon Horizon", desc: "4 Треки Квантового Світу" },
      forge: { label: "Хвильовий Синтезатор", desc: "Алгоритмічна Студія" },
      oracle: { label: "ІІ-Навігатор", desc: "Мотиваційні Частоти" },
    },
    genesis: {
      badge: "Хроніки Джерела (Origin Genesis)",
      title: "ВІД МІДНИХ ТРУБ ДО КВАНТОВОГО СИНТЕЗУ",
      intro: "Історія Vizua — це не просто творчий шлях, це подорож орбітами звуку завдовжки в життя. Народжений в Україні, вихований батьком-мультиінструменталістом, пройшовши через епоху діджейства кінця 90-х, я поєднав тепло класичних духових інструментів із прохолодною силою космічних синтезаторів.",
      quote: "«Музика — це єдиний міст між матеріальним світом та квантовими вимірами. Мої треки створені, щоб дарувати легкість, натхнення та мотивувати на звершення.» — Vizua",
      timeline: {
        childhood: {
          year: "Дитинство & Родина",
          title: "Українське Коріння та Мідні Духові",
          text: "Народившись в Україні, я з самого раннього дитинства був занурений у світ живого звуку. Мій перший музичний досвід розпочався з гри на духових інструментах, що виховало в мені дисципліну звуку та відчуття гармонії."
        },
        father: {
          year: "Спадщина Батька",
          title: "Мультиінструментальне Благословення",
          text: "Мій батько — професійний музикант-духовик, ударник та клавішник. Саме він запалив у мені цю вічну іскру, навчивши слухати ритм всесвіту та розуміти, як народжується музика з повітря та пристрасті."
        },
        vintage: {
          year: "Кінець 90-х",
          title: "Київський DJ-Андеграунд",
          text: "Наприкінці 90-х років я загорівся сучасною клубною електронікою. Роки виступів як діджея на українській сцені відточили моє розуміння того, як звук рухає людьми та змушує їхні серця битися в один такт."
        },
        future: {
          year: "2026 & Майбутнє",
          title: "Народження Композитора & Квантовий Стрибок",
          text: "Після багатьох років за діджейським пультом я прийшов до написання власної музики. Сьогодні Vizua — це поєднання живого духового минулого та квантового електронного майбутнього. Яскраві, легкі, мотивувальні треки."
        }
      }
    },
    album: {
      badge: "ПЕРШИЙ КОСМІЧНИЙ АЛЬБОМ",
      title: "NEON HORIZON (2026)",
      quote: "«Це маніфест свободи, легкості та вічного руху крізь мерехтливі горизонти.»",
      desc: "Кожен трек альбому — це окрема квантова станція зі своєю гравітацією, атмосферою та темпом. Тут переплітаються легкі мелодійні арпеджіо, енергійні кислотні баси та піднесені духові соло, що віддають данину поваги моїм витокам.",
      motivateTitle: "Інтелектуальна мотивація",
      motivateDesc: "Використовуйте наш синтезаторний пульт керування, щоб прослухати procedural-версії треків просто зараз у реальному часі!",
    },
    synth: {
      title: "КВАНТОВИЙ СИНТ-КОР ГЕНЕРАТОР",
      subtitle: "Живий алгоритмічний двигун синтезу. Без статичного аудіо.",
      visualizer: "ВІЗУАЛІЗАТОР ЧАСТОТ",
      oscillator: "ТИП ОСЦИЛЯТОРА",
      filter: "РЕЗОНАНС LP ФІЛЬТРА",
      delay: "КОСМІЧНИЙ ДЕЛЕЙ ЕХО",
      keyboardLabel: "Торкніться/Клацніть, щоб генерувати квантові хвилі енергії:",
    },
    oracle: {
      badge: "Інтерактивне квантове ядро (AI Navigator)",
      title: "СПРЯМУЙ СВІЙ ВІБРАЦІЙНИЙ ПОТІК",
      desc: "Введіть ваші параметри, оберіть сектор нашої альтернативної системи Vizua та отримайте персоналізовану музичну та інтелектуальну мотивацію.",
      form: {
        name: "Ваше Ім'я / Код мандрівника",
        namePlaceholder: "Напр. Ярослав",
        coord: "Координати Порталу",
        coordPlaceholder: "Напр. Q-3091",
        sectorLabel: "Вибір Сектора Системи Vizua",
        prompt: "Ваш Поточний Настрій / Запит у Всесвіт",
        promptPlaceholder: "Напр. Мені потрібна мотивація перед запуском нового проекту...",
        submitBtn: "Ініціалізувати Спалах Ядра",
        submitLoading: "Квантове моделювання...",
      },
      log: {
        title: "QUANTUM_NAVIGATOR.LOG",
        waiting: "Очікування імпульсу. Заповніть дані ліворуч та активуйте ядро, щоб отримати навігаційну частоту.",
        coordLabel: "КООРДИНАТА МЕРЕЖІ",
        status: "СТАТУС",
        statusReady: "ГОТОВИЙ ДО ПОТОКУ",
        statusActive: "ТРАНСЛЯЦІЯ",
      },
    },
    footer: {
      title: "VIZUA WORLD",
      desc: "Композитор, DJ та квантовий навігатор. Родом з України. Творимо майбутнє електронної сцени з 2026 року.",
      telemetry: "Квантова Телеметрія",
      platforms: "Спектральні Платформи",
      copyright: "© 2026 Vizua. Всі космічні права захищені.",
    },
  },
  en: {
    header: {
      tagline: "Quantum Electronic Dimension",
      indicators: {
        hq: "UA-HQ_COMPOSER",
        sector: "KYIV_SECTOR",
      },
      tabs: {
        genesis: "Origins",
        album: "Neon Horizon",
        forge: "Wave Synth",
        oracle: "Quantum Oracle",
      },
    },
    hero: {
      badge: "A New Era of Music: 2026",
      title: "VIZUA NEON HORIZON",
      subtitle: "I create bright, intelligent, and deep electronic soundscapes designed to motivate you forward. Explore quantum universes, synthesize sound waves in our alternative solar system, and locate true inner harmony.",
      btnAlbum: "Explore Album",
      btnSynth: "Launch Wave Synth",
    },
    tabsNav: {
      genesis: { label: "Origins & Legacy", desc: "Family, Ukraine, DJ Journey" },
      album: { label: "Neon Horizon Album", desc: "4 Quantum Dimension Tracks" },
      forge: { label: "Waveform Synthesizer", desc: "Algorithmic Studio Core" },
      oracle: { label: "AI Space Navigator", desc: "Motivational Vibrational Freq" },
    },
    genesis: {
      badge: "Origin Genesis Chronicles",
      title: "FROM BRASS WINDS TO QUANTUM SYNTHESIS",
      intro: "The story of Vizua is a lifetime travel along the orbits of sound. Born in Ukraine, raised by a multi-instrumentalist father, and shaped by the late-90s Kyiv underground DJ culture, I merged the warmth of classical brass with the cold power of cosmic synthesizers.",
      quote: "«Music is the only bridge connecting the tangible world with quantum dimensions. My tracks are made to inspire, elevate, and motivate you toward greatness.» — Vizua",
      timeline: {
        childhood: {
          year: "Childhood & Homeland",
          title: "Ukrainian Roots & Brass Winds",
          text: "Born in Ukraine, I was fully immersed in real, organic sound from early childhood. My musical path started with playing brass wind instruments, teaching me sonic discipline and the foundations of harmony."
        },
        father: {
          year: "Father's Legacy",
          title: "Multi-Instrumental Blessing",
          text: "My father is a professional brass musician, percussionist, and keyboardist. He ignited the spark within me, teaching me to listen to the rhythm of the cosmos and understand how breath turns to melody."
        },
        vintage: {
          year: "Late 90s",
          title: "Kyiv DJ Underground",
          text: "In the late 90s, I became obsessed with modern club electronica. Years performing as a DJ in the Ukrainian scene sharpened my understanding of how sound moves crowds and syncs heartbeats."
        },
        future: {
          year: "2026 & Beyond",
          title: "Birth of a Composer",
          text: "After decades behind the DJ booth, I transitioned into writing my own compositions. Vizua is the junction of a physical past and a quantum future. Light, inspiring, motivating tracks."
        }
      }
    },
    album: {
      badge: "DEBUT SPACE ALBUM",
      title: "NEON HORIZON (2026)",
      quote: "«This is a manifesto of freedom, lightweight elegance, and eternal flight through shimmering horizons.»",
      desc: "Each track of the album is a unique quantum station with its own gravity, atmosphere, and tempo. Discover lightweight melodic arpeggios, pulsing acid basslines, and majestic synthesized brass leads that honor my roots.",
      motivateTitle: "Intellectual Motivation",
      motivateDesc: "Use our interactive synthesizer console to play procedural versions of these tracks in real-time right now!",
    },
    synth: {
      title: "QUANTUM SYNTH-CORE GENERATOR",
      subtitle: "Live algorithmic synthesis engine. No static audio files used.",
      visualizer: "FREQUENCY SPECTRUM",
      oscillator: "OSCILLATOR TYPE",
      filter: "LP FILTER CUTOFF",
      delay: "SPACE DELAY ECHO",
      keyboardLabel: "Touch/Click keyboard keys to generate quantum energy waves:",
    },
    oracle: {
      badge: "Interactive Quantum Core (AI Navigator)",
      title: "DIRECT YOUR VIBRATIONAL FLOW",
      desc: "Input your navigation coordinates, select a sector in the Vizua solar system, and receive tailored musical & motivational guidance.",
      form: {
        name: "Traveler Name / Call Sign",
        namePlaceholder: "e.g., Jarek",
        coord: "Portal Coordinates",
        coordPlaceholder: "e.g., Q-3091",
        sectorLabel: "Select Vizua System Sector",
        prompt: "Your Current Mood / Cosmic Intention",
        promptPlaceholder: "e.g., I need some focus and energy for my upcoming release...",
        submitBtn: "Initialize Core Flare",
        submitLoading: "Simulating Quantum Flux...",
      },
      log: {
        title: "QUANTUM_NAVIGATOR.LOG",
        waiting: "Awaiting impulse. Enter details on the left and trigger the core to stream navigational frequencies.",
        coordLabel: "NETWORK COORDINATE",
        status: "STATUS",
        statusReady: "READY TO STREAM",
        statusActive: "BROADCASTING",
      },
    },
    footer: {
      title: "VIZUA WORLD",
      desc: "Composer, DJ, and quantum navigator from Ukraine. Shaping the future of the electronic scene since 2026.",
      telemetry: "Quantum Telemetry",
      platforms: "Spectral Platforms",
      copyright: "© 2026 Vizua. All cosmic rights reserved.",
    },
  },
  ru: {
    header: {
      tagline: "Квантовое Электронное Измерение",
      indicators: {
        hq: "UA-HQ_КОМПОЗИТОР",
        sector: "КИЕВСКИЙ_СЕКТОР",
      },
      tabs: {
        genesis: "Истоки",
        album: "Neon Horizon",
        forge: "Синтезатор",
        oracle: "Квантовый Оракул",
      },
    },
    hero: {
      badge: "Новая Эра Музыки: 2026",
      title: "VIZUA NEON HORIZON",
      subtitle: "Я создаю яркий, умный и глубокий электронный звук, мотивирующий двигаться только вперед. Открывайте квантовые миры, синтезируйте звуковые колебания в нашей альтернативной системе и находите истинную гармонию.",
      btnAlbum: "Исследовать Альбом",
      btnSynth: "Запустить Синтезатор",
    },
    tabsNav: {
      genesis: { label: "Истоки & Наследие", desc: "Семья, Украина, DJ Путь" },
      album: { label: "Альбом Neon Horizon", desc: "4 Трека Квантового Мира" },
      forge: { label: "Волновой Синтезатор", desc: "Алгоритмическая Студия" },
      oracle: { label: "ИИ-Навигатор", desc: "Мотивационные Частоты" },
    },
    genesis: {
      badge: "Хроники Источника (Origin Genesis)",
      title: "ОТ МЕДНЫХ ТРУБ ДО КВАНТОВОГО СИНТЕЗА",
      intro: "История Vizua — это не просто творческий путь, это путешествие по орбитам звука длиною в жизнь. Рожденный в Украине, воспитанный отцом-мультиинструменталистом, прошедший через эпоху диджейства конца 90-х, я соединил тепло классических духовых инструментов с прохладной мощью космических синтезаторов.",
      quote: "«Музыка — это единственный мост между осязаемым миром и квантовыми измерениями. Мои треки созданы, чтобы дарить легкость, вдохновение и мотивировать на свершения.» — Vizua",
      timeline: {
        childhood: {
          year: "Детство & Родина",
          title: "Украинские Корни и Медные Духовые",
          text: "Родившись в Украине, я с самого раннего детства был погружен в мир живого звука. Мій первый музыкальный опыт начался с игры на духовых инструментах, прививая мне дисциплину звука и чувство гармонии."
        },
        father: {
          year: "Наследие Отца",
          title: "Мультиинструментальное Благословение",
          text: "Мой отец — профессиональный музыкант-духовик, ударник и клавишник. Именно он зажег во мне эту вечную искру, научив слушать ритм вселенной и понимать, как рождается музыка из воздуха и страсти."
        },
        vintage: {
          year: "Конец 90-х",
          title: "Киевский DJ-Андеграунд",
          text: "В конце 90-х годов я загорелся современной клубной электроникой. Годы выступлений в качестве диджея на украинской сцене отточили мое понимание того, как звук движет людьми и заставляет их сердца биться в один такт."
        },
        future: {
          year: "2026 & Будущее",
          title: "Рождение Композитора & Квантовый Скачок",
          text: "После долгих лет за диджейским пультом я пришел к написанию собственной музыки. Сегодня Vizua — это соединение живого духовного прошлого и квантового электронного будущего. Яркие, легкие, мотивирующие треки."
        }
      }
    },
    album: {
      badge: "ПЕРВЫЙ КОСМИЧЕСКИЙ АЛЬБОМ",
      title: "NEON HORIZON (2026)",
      quote: "«Это манифест свободы, легкости и вечного движения сквозь мерцающие горизонты.»",
      desc: "Каждый трек альбома — это отдельная квантовая станция со своей гравитацией, атмосферой и темпом. Здесь переплетаются легкие мелодичные арпеджио, энергичные кислотные басы и возвышенные духовые соло, отдающие дань уважения моим истокам.",
      motivateTitle: "Интеллектуальная мотивация",
      motivateDesc: "Используйте наш синтезаторный пульт управления, чтобы прослушать procedural-версии треков прямо сейчас в реальном времени!",
    },
    synth: {
      title: "QUANTUM SYNTH-CORE GENERATOR",
      subtitle: "Живой алгоритмический движок синтеза. Без статического аудио.",
      visualizer: "ВИЗУАЛИЗАТОР ЧАСТОТ",
      oscillator: "ТИП ОСЦИЛЛЯТОРА",
      filter: "РЕЗОНАНС LP ФИЛЬТРА",
      delay: "КОСМИЧЕСКИЙ ДЕЛЕЙ ЭХО",
      keyboardLabel: "Торкнитесь/Кликните клавиши для генерации квантовых волн энергии:",
    },
    oracle: {
      badge: "Интерактивное квантовое ядро (AI Navigator)",
      title: "НАПРАВЬ СВОЙ ВИБРАЦИОННЫЙ ПОТОК",
      desc: "Введите ваши параметры, выберите сектор нашей альтернативной системы Vizua, и получите персонализированную музыкальную и интеллектуальную мотивацию.",
      form: {
        name: "Ваше Имя / Код путешественника",
        namePlaceholder: "Напр. Yaroslav",
        coord: "Координаты Портала",
        coordPlaceholder: "Напр. Q-3091",
        sectorLabel: "Выбор Сектора Системы Vizua",
        prompt: "Ваш Текущий Жизненный Настрой / Запрос во Вселенную",
        promptPlaceholder: "Напр. Мне нужно немного мотивации перед запуском проекта...",
        submitBtn: "Инициализировать Вспышку Ядра",
        submitLoading: "Квантовое моделирование...",
      },
      log: {
        title: "QUANTUM_NAVIGATOR.LOG",
        waiting: "Ожидание импульса. Заполните данные слева и активируйте ядро, чтобы получить навигационную частоту.",
        coordLabel: "КООРДИНАТА СЕТИ",
        status: "СТАТУС",
        statusReady: "ГОТОВ К ПОТОКУ",
        statusActive: "ТРАНСЛЯЦИЯ",
      },
    },
    footer: {
      title: "VIZUA WORLD",
      desc: "Композитор, DJ и квантовый навигатор. Родом из Украины. Творим будущее электронной сцены с 2026 года.",
      telemetry: "Квантовая Телеметрия",
      platforms: "Спектральные Платформы",
      copyright: "© 2026 Vizua. All cosmic rights reserved.",
    },
  },
};
