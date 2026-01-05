export type SupportedLanguage = 'en' | 'es' | 'ja' | 'fr' | 'el';

interface NavLink {
  key: string;
  href: string;
  label: string;
}

export interface TranslationShape {
  navbar: {
    links: NavLink[];
    signIn: string;
    languageLabel: string;
  };
  hero: {
    tagline: string;
    titleLineOne: string;
    titleAccent: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  about: {
    eyebrow: string;
    headlineStart: string;
    headlineAccent: string;
    body: string;
    features: Array<{ title: string; description: string }>;
  };
  worldMap: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    description: string;
  };
  gallery: {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    subtitle: string;
  };
  breakingBanner: {
    text: string;
  };
  members: {
    eyebrow: string;
    headlineStart: string;
    headlineAccent: string;
    description: string;
    searchPlaceholder: string;
    loading: string;
    emptyMessage: (query: string) => string;
    table: {
      driver: string;
      machine: string;
      location: string;
      age: string;
      showing: (start: number, end: number, total: number) => string;
    };
  };
  events: {
    eyebrow: string;
    headlineStart: string;
    headlineAccent: string;
    empty: string;
    toBeAnnounced: string;
    modalTitle: string;
    modalEndsLabel: string;
    buttonDefault: string;
    buttonRsvped: string;
    errorFallback: string;
  };
  contact: {
    eyebrow: string;
    headlineStart: string;
    headlineAccent: string;
    description: string;
    emailLabel: string;
    emailValue: string;
    instagramLabel: string;
    instagramHandle: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      handleLabel: string;
      handlePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      messageMinNote: (minChars: number) => string;
      messageTooShort: (minChars: number) => string;
      submitIdle: string;
      submitSubmitting: string;
      submitSuccess: string;
      submitError: string;
      successMessage: string;
      genericError: string;
    };
  };
  footer: {
    rights: string;
    poweredByPrefix: string;
    poweredByName: string;
    links: {
      decals: string;
      customCars: string;
      home: string;
    };
  };
}

export const translations: Record<SupportedLanguage, TranslationShape> = {
  en: {
    navbar: {
      links: [
        { key: 'showcase', href: '#gallery', label: 'Showcase' },
        { key: 'about', href: '#about', label: 'About' },
        { key: 'members', href: '#members', label: 'Members' },
        { key: 'events', href: '#events', label: 'Events' },
        { key: 'contact', href: '#contact', label: 'Join Us' }
      ],
      signIn: 'Sign In',
      languageLabel: 'Languages'
    },
    hero: {
      tagline: 'Est. 2018 • Worldwide Community',
      titleLineOne: 'Unleash',
      titleAccent: 'The Legacy',
      description: 'The ultimate collective for Honda enthusiasts. From street stance to track performance, we define the culture.',
      primaryCta: 'Explore Builds',
      secondaryCta: 'Join The Unit'
    },
    about: {
      eyebrow: 'Who We Are',
      headlineStart: 'More Than A',
      headlineAccent: 'Car Club.',
      body: `Hondaunit started as a small group of friends in 2018 and has grown into a global movement. We celebrate the legacy of Soichiro Honda through every chassis code, from EF to FL5.

We believe in respect, quality builds, and driving our cars the way they were meant to be driven. Whether you're tracking an S2000 or restoring a classic CRX, you have a place here.`,
      features: [
        {
          title: 'The Community',
          description: 'A brotherhood of enthusiasts connected by a shared passion for engineering perfection.'
        },
        {
          title: 'The Craft',
          description: "We don't just drive; we build. Every bolt turned is a testament to dedication."
        },
        {
          title: 'The Culture',
          description: 'From midnight runs to car shows, we represent the best of the JDM lifestyle.'
        }
      ]
    },
    worldMap: {
      eyebrow: 'Global Presence',
      headline: 'Worldwide ',
      headlineAccent: 'Domination',
      description: 'From the expressways of Tokyo to the canyons of LA. We are everywhere the VTEC kicks in.'
    },
    gallery: {
      eyebrow: 'Visual Diary',
      titleStart: 'The',
      titleAccent: 'Archives',
      subtitle: 'Few of the best'
    },
    breakingBanner: {
      text: 'HONDAUNIT /// THE LEGACY /// EST. 2018 ///'
    },
    members: {
      eyebrow: 'The Squad',
      headlineStart: 'Official',
      headlineAccent: 'Roster',
      description: 'Meet the HondaUnit community. Click on any member to view their profile.',
      searchPlaceholder: 'Search by name, instagram, or machine...',
      loading: 'Loading squad members...',
      emptyMessage: (query: string) => `No members found matching "${query}"`,
      table: {
        driver: 'Driver',
        machine: 'Machine',
        location: 'Location',
        age: 'Age',
        showing: (start, end, total) => `Showing ${start}-${end} of ${total} Members`
      }
    },
    events: {
      eyebrow: 'Tour Dates',
      headlineStart: 'Upcoming',
      headlineAccent: 'Meets',
      empty: 'No upcoming events yet. Check back soon!',
      toBeAnnounced: 'To be announced',
      modalTitle: 'Event Details',
      modalEndsLabel: 'Ends',
      buttonDefault: 'View Details',
      buttonRsvped: 'View Details',
      errorFallback: 'Failed to load events'
    },
    contact: {
      eyebrow: 'Join The Unit',
      headlineStart: 'Build Your',
      headlineAccent: 'Legacy',
      description: `Have a build that deserves the spotlight? Want to collaborate or sponsor an event? Drop us a line.
We are constantly scouting for the cleanest chassis and most dedicated builders.`,
      emailLabel: 'Email',
      emailValue: 'info@hondaunit.com',
      instagramLabel: 'Instagram',
      instagramHandle: '@hondaunit',
      form: {
        nameLabel: 'Name',
        namePlaceholder: 'Drift King',
        handleLabel: 'IG Handle',
        handlePlaceholder: '@username',
        emailLabel: 'Email',
        emailPlaceholder: 'racer@example.com',
        messageLabel: 'Message',
        messagePlaceholder: 'Tell us about your build...',
        messageMinNote: (min: number) => `write at least ${min} characters`,
        messageTooShort: (min: number) => `Please type at least ${min} characters before sending.`,
        submitIdle: 'Send Message',
        submitSubmitting: 'Sending...',
        submitSuccess: 'Message Sent',
        submitError: 'Retry',
        successMessage: 'Legendary! We received your message. We will get back to you as soon as possible.',
        genericError: 'There is an issue with your submission. Please try again.'
      }
    },
    footer: {
      rights: '© 2025 Hondaunit Community. All rights reserved.',
      poweredByPrefix: 'Powered by',
      poweredByName: 'DevMonix Technologies',
      links: {
        decals: 'Decal Store',
        customCars: 'Custom Build Cars',
        home: 'Home'
      }
    }
  },
  es: {
    navbar: {
      links: [
        { key: 'showcase', href: '#gallery', label: 'Galería' },
        { key: 'about', href: '#about', label: 'Nosotros' },
        { key: 'members', href: '#members', label: 'Miembros' },
        { key: 'events', href: '#events', label: 'Eventos' },
        { key: 'contact', href: '#contact', label: 'Únete' }
      ],
      signIn: 'Iniciar sesión',
      languageLabel: 'Idiomas'
    },
    hero: {
      tagline: 'Desde 2018 • Comunidad Mundial',
      titleLineOne: 'Desata',
      titleAccent: 'La Leyenda',
      description: 'El colectivo definitivo para los entusiastas de Honda. De la calle al circuito, marcamos la cultura.',
      primaryCta: 'Ver Builds',
      secondaryCta: 'Únete a la Unidad'
    },
    about: {
      eyebrow: 'Quiénes Somos',
      headlineStart: 'Más que un',
      headlineAccent: 'Club de Autos.',
      body: `Hondaunit comenzó como un pequeño grupo de amigos en 2018 y se convirtió en un movimiento global. Celebramos el legado de Soichiro Honda en cada chasis, del EF al FL5.

Creemos en el respeto, los builds de calidad y conducir nuestros autos como se debe. Ya sea que lleves un S2000 a la pista o restaures un CRX clásico, aquí tienes tu espacio.`,
      features: [
        {
          title: 'La Comunidad',
          description: 'Una hermandad de entusiastas unidos por la pasión hacia la ingeniería perfecta.'
        },
        {
          title: 'El Oficio',
          description: 'No solo manejamos: construimos. Cada tornillo es prueba de nuestra dedicación.'
        },
        {
          title: 'La Cultura',
          description: 'De las rutas nocturnas a los shows, representamos lo mejor del estilo JDM.'
        }
      ]
    },
    worldMap: {
      eyebrow: 'Presencia Global',
      headline: 'Dominio ',
      headlineAccent: 'Mundial',
      description: 'De las autopistas de Tokio a los cañones de Los Ángeles. Estamos donde entra el VTEC.'
    },
    gallery: {
      eyebrow: 'Diario Visual',
      titleStart: 'Los',
      titleAccent: 'Archivos',
      subtitle: 'Selección 2024-2025'
    },
    breakingBanner: {
      text: 'HONDAUNIT /// LA LEYENDA /// DESDE 2018 ///'
    },
    members: {
      eyebrow: 'La Escuadra',
      headlineStart: 'Lista',
      headlineAccent: 'Oficial',
      description: 'Conoce a la comunidad HondaUnit. Haz clic en cualquier miembro para ver su perfil.',
      searchPlaceholder: 'Busca por nombre, instagram o máquina...',
      loading: 'Cargando miembros...',
      emptyMessage: (query: string) => `Sin resultados para "${query}"`,
      table: {
        driver: 'Piloto',
        machine: 'Máquina',
        location: 'Ubicación',
        age: 'Edad',
        showing: (start, end, total) => `Mostrando ${start}-${end} de ${total} miembros`
      }
    },
    events: {
      eyebrow: 'Fechas del Tour',
      headlineStart: 'Próximas',
      headlineAccent: 'Reuniones',
      empty: 'No hay eventos programados. Vuelve pronto.',
      toBeAnnounced: 'Por anunciar',
      modalTitle: 'Detalles del evento',
      modalEndsLabel: 'Termina',
      buttonDefault: 'Ver detalles',
      buttonRsvped: 'Ver detalles',
      errorFallback: 'No se pudieron cargar los eventos'
    },
    contact: {
      eyebrow: 'Únete a la Unidad',
      headlineStart: 'Construye tu',
      headlineAccent: 'Legado',
      description: `¿Tienes un build que merece atención? ¿Quieres colaborar o patrocinar un evento? Escríbenos.
Siempre buscamos los chasis más limpios y a los constructores más dedicados.`,
      emailLabel: 'Correo',
      emailValue: 'info@hondaunit.com',
      instagramLabel: 'Instagram',
      instagramHandle: '@hondaunit',
      form: {
        nameLabel: 'Nombre',
        namePlaceholder: 'Drift King',
        handleLabel: 'Usuario de IG',
        handlePlaceholder: '@usuario',
        emailLabel: 'Correo',
        emailPlaceholder: 'piloto@ejemplo.com',
        messageLabel: 'Mensaje',
        messagePlaceholder: 'Cuéntanos sobre tu build...',
        messageMinNote: (min: number) => `Mínimo ${min} caracteres`,
        messageTooShort: (min: number) => `Escribe al menos ${min} caracteres antes de enviar.`,
        submitIdle: 'Enviar mensaje',
        submitSubmitting: 'Enviando...',
        submitSuccess: 'Mensaje enviado',
        submitError: 'Reintentar',
        successMessage: '¡Legendario! Recibimos tu build; revisa tu correo para confirmar.',
        genericError: 'No pudimos contactar al equipo. Intenta de nuevo en unos momentos.'
      }
    },
    footer: {
      rights: '© 2025 Comunidad Hondaunit. Todos los derechos reservados.',
      poweredByPrefix: 'Desarrollado por',
      poweredByName: 'DevMonix Technologies',
      links: {
        decals: 'Tienda de Calcomanías',
        customCars: 'Custom Build Cars',
        home: 'Inicio'
      }
    }
  },
  ja: {
    navbar: {
      links: [
        { key: 'showcase', href: '#gallery', label: 'ショーケース' },
        { key: 'about', href: '#about', label: '私たちについて' },
        { key: 'members', href: '#members', label: 'メンバー' },
        { key: 'events', href: '#events', label: 'イベント' },
        { key: 'contact', href: '#contact', label: '参加する' }
      ],
      signIn: 'ログイン',
      languageLabel: '言語'
    },
    hero: {
      tagline: '2018年設立 • 世界規模のコミュニティ',
      titleLineOne: '解き放て',
      titleAccent: 'レガシーを',
      description: 'ホンダを愛する人のための究極の集団。ストリートからサーキットまで、カルチャーを創る。',
      primaryCta: 'ビルドを見る',
      secondaryCta: 'ユニットに参加'
    },
    about: {
      eyebrow: '私たちについて',
      headlineStart: '単なる',
      headlineAccent: 'カークラブではない。',
      body: `Hondaunitは2018年に友人同士の小さな集まりから始まり、今では世界的なムーブメントへ。EFからFL5まで、すべてのシャシーで本田宗一郎の遺産を称えます。

私たちはリスペクトと高品質なビルド、そして本来の走り方を信条としています。S2000でサーキットを攻める人も、CRXをレストアする人も、ここに仲間がいます。`,
      features: [
        {
          title: 'コミュニティ',
          description: '完璧なエンジニアリングを追求する情熱で結ばれた仲間たち。'
        },
        {
          title: 'クラフト',
          description: 'ただ運転するのではなく、作り上げる。一つひとつのボルトに魂をこめる。'
        },
        {
          title: 'カルチャー',
          description: '深夜の走りからショーまで、JDM文化の最前線を体現する。'
        }
      ]
    },
    worldMap: {
      eyebrow: 'グローバル展開',
      headline: '世界規',
      headlineAccent: '模の支配',
      description: '東京の首都高からLAのキャニオンまで。VTECが目覚める場所に私たちはいる。'
    },
    gallery: {
      eyebrow: 'ビジュアルダイアリー',
      titleStart: '伝説の',
      titleAccent: 'アーカイブ',
      subtitle: '厳選ショット 2024-2025'
    },
    breakingBanner: {
      text: 'HONDAUNIT /// レガシー /// 2018年設立 ///'
    },
    members: {
      eyebrow: 'スコード',
      headlineStart: 'オフィシャル',
      headlineAccent: 'ロスター',
      description: 'HondaUnitコミュニティを紹介。メンバーをクリックしてプロフィールを表示。',
      searchPlaceholder: '名前・Instagram・マシンで検索...',
      loading: 'メンバーを読み込み中...',
      emptyMessage: (query: string) => `「${query}」に一致するメンバーはいません`,
      table: {
        driver: 'ドライバー',
        machine: 'マシン',
        location: '所在地',
        age: '年齢',
        showing: (start, end, total) => `${start}〜${end} / 全${total}人`
      }
    },
    events: {
      eyebrow: 'ツアー日程',
      headlineStart: '次の',
      headlineAccent: 'ミート',
      empty: '現在予定されているイベントはありません。近日公開。',
      toBeAnnounced: '調整中',
      modalTitle: 'イベント詳細',
      modalEndsLabel: '終了',
      buttonDefault: '詳細を見る',
      buttonRsvped: '詳細を見る',
      errorFallback: 'イベントを読み込めませんでした'
    },
    contact: {
      eyebrow: 'ユニットに参加',
      headlineStart: 'レガシーを',
      headlineAccent: '築け',
      description: `あなたのビルドを見せたい？イベントの協賛やコラボに興味がある？メッセージを送ってください。
常に最もクリーンなシャシーと本気のビルダーを探しています。`,
      emailLabel: 'メール',
      emailValue: 'info@hondaunit.com',
      instagramLabel: 'インスタグラム',
      instagramHandle: '@hondaunit',
      form: {
        nameLabel: '名前',
        namePlaceholder: 'Drift King',
        handleLabel: 'IGハンドル',
        handlePlaceholder: '@username',
        emailLabel: 'メール',
        emailPlaceholder: 'racer@example.com',
        messageLabel: 'メッセージ',
        messagePlaceholder: 'ビルド内容を教えてください...',
        messageMinNote: (min: number) => `最低 ${min} 文字`,
        messageTooShort: (min: number) => `${min}文字以上でメッセージを入力してください。`,
        submitIdle: 'メッセージ送信',
        submitSubmitting: '送信中...',
        submitSuccess: '送信完了',
        submitError: '再試行',
        successMessage: '受信しました！確認メールをご覧ください。',
        genericError: 'サーバーに接続できませんでした。時間をおいて再度お試しください。'
      }
    },
    footer: {
      rights: '© 2025 Hondaunit Community. All rights reserved.',
      poweredByPrefix: 'Powered by',
      poweredByName: 'DevMonix Technologies',
      links: {
        decals: 'デカールショップ',
        customCars: 'Custom Build Cars',
        home: 'トップ'
      }
    }
  },
  fr: {
    navbar: {
      links: [
        { key: 'showcase', href: '#gallery', label: 'Vitrine' },
        { key: 'about', href: '#about', label: 'À propos' },
        { key: 'members', href: '#members', label: 'Membres' },
        { key: 'events', href: '#events', label: 'Événements' },
        { key: 'contact', href: '#contact', label: 'Rejoindre' }
      ],
      signIn: 'Connexion',
      languageLabel: 'Langues'
    },
    hero: {
      tagline: 'Depuis 2018 • Communauté mondiale',
      titleLineOne: 'Libère',
      titleAccent: 'L’Héritage',
      description: 'Le collectif ultime pour les passionnés de Honda. De la rue au circuit, nous définissons la culture.',
      primaryCta: 'Explorer les Builds',
      secondaryCta: 'Rejoindre l’Unité'
    },
    about: {
      eyebrow: 'Qui Nous Sommes',
      headlineStart: 'Plus qu’un',
      headlineAccent: 'Club Automobile.',
      body: `Hondaunit est né en 2018 d’un petit groupe d’amis et est devenu un mouvement mondial. Nous célébrons l’héritage de Soichiro Honda sur chaque châssis, du EF au FL5.

Nous croyons au respect, aux builds de qualité et à conduire nos voitures comme il se doit. Que tu pousses une S2000 sur piste ou que tu restaures une CRX classique, tu es chez toi ici.`,
      features: [
        {
          title: 'La Communauté',
          description: 'Une fraternité d’enthousiastes unis par la passion de l’ingénierie parfaite.'
        },
        {
          title: 'Le Savoir-Faire',
          description: 'Nous ne faisons pas que conduire : nous construisons. Chaque boulon témoigne de notre dévouement.'
        },
        {
          title: 'La Culture',
          description: 'Des runs nocturnes aux salons, nous incarnons le meilleur du JDM.'
        }
      ]
    },
    worldMap: {
      eyebrow: 'Présence Mondiale',
      headline: 'Domination ',
      headlineAccent: 'Globale',
      description: 'Des autoroutes de Tokyo aux canyons de Los Angeles. Partout où le VTEC hurle, nous sommes là.'
    },
    gallery: {
      eyebrow: 'Journal Visuel',
      titleStart: 'Les',
      titleAccent: 'Archives',
      subtitle: 'Sélection 2024-2025'
    },
    breakingBanner: {
      text: 'HONDAUNIT /// L’HÉRITAGE /// DEPUIS 2018 ///'
    },
    members: {
      eyebrow: 'L’Équipe',
      headlineStart: 'Effectif',
      headlineAccent: 'Officiel',
      description: 'Découvrez la communauté HondaUnit. Cliquez sur un membre pour afficher son profil.',
      searchPlaceholder: 'Chercher par nom, Instagram ou machine...',
      loading: 'Chargement des membres...',
      emptyMessage: (query: string) => `Aucun membre trouvé pour « ${query} »`,
      table: {
        driver: 'Pilote',
        machine: 'Machine',
        location: 'Lieu',
        age: 'Âge',
        showing: (start, end, total) => `Affichage ${start}-${end} sur ${total} membres`
      }
    },
    events: {
      eyebrow: 'Dates de Tournée',
      headlineStart: 'Meets',
      headlineAccent: 'À Venir',
      empty: 'Aucun événement prévu pour le moment. Revenez vite.',
      toBeAnnounced: 'À confirmer',
      modalTitle: 'Détails de l’événement',
      modalEndsLabel: 'Se termine',
      buttonDefault: 'Voir les détails',
      buttonRsvped: 'Voir les détails',
      errorFallback: 'Impossible de charger les événements'
    },
    contact: {
      eyebrow: 'Rejoins l’Unité',
      headlineStart: 'Construis ta',
      headlineAccent: 'Légende',
      description: `Tu as un build qui mérite la lumière ? Besoin d’un partenariat ou d’un sponsoring ?
Écris-nous : nous cherchons en permanence les châssis les plus propres et les pilotes les plus engagés.`,
      emailLabel: 'Email',
      emailValue: 'info@hondaunit.com',
      instagramLabel: 'Instagram',
      instagramHandle: '@hondaunit',
      form: {
        nameLabel: 'Nom',
        namePlaceholder: 'Drift King',
        handleLabel: 'Pseudo IG',
        handlePlaceholder: '@pseudo',
        emailLabel: 'Email',
        emailPlaceholder: 'pilote@exemple.com',
        messageLabel: 'Message',
        messagePlaceholder: 'Parle-nous de ton build...',
        messageMinNote: (min: number) => `Minimum ${min} caractères`,
        messageTooShort: (min: number) => `Merci d’écrire au moins ${min} caractères avant d’envoyer.`,
        submitIdle: 'Envoyer',
        submitSubmitting: 'Envoi...',
        submitSuccess: 'Message envoyé',
        submitError: 'Réessayer',
        successMessage: 'Légendaire ! Nous avons bien reçu ton message—regarde ta boîte mail.',
        genericError: 'Impossible de contacter les stands. Réessaie dans un instant.'
      }
    },
    footer: {
      rights: '© 2025 Communauté Hondaunit. Tous droits réservés.',
      poweredByPrefix: 'Propulsé par',
      poweredByName: 'DevMonix Technologies',
      links: {
        decals: 'Boutique de Stickers',
        customCars: 'Custom Build Cars',
        home: 'Accueil'
      }
    }
  },
  el: {
    navbar: {
      links: [
        { key: 'showcase', href: '#gallery', label: 'Συλλογή' },
        { key: 'about', href: '#about', label: 'Σχετικά' },
        { key: 'members', href: '#members', label: 'Μέλη' },
        { key: 'events', href: '#events', label: 'Εκδηλώσεις' },
        { key: 'contact', href: '#contact', label: 'Συμμετοχή' }
      ],
      signIn: 'Σύνδεση',
      languageLabel: 'Γλώσσες'
    },
    hero: {
      tagline: 'Από το 2018 • Παγκόσμια Κοινότητα',
      titleLineOne: 'Απελευθέρωσε',
      titleAccent: 'Την Κληρονομιά',
      description: 'Το απόλυτο κολεκτίβο για όσους ζουν και αναπνέουν Honda. Από τους δρόμους έως την πίστα, ορίζουμε την κουλτούρα.',
      primaryCta: 'Δες τα Builds',
      secondaryCta: 'Μπες στην Ομάδα'
    },
    about: {
      eyebrow: 'Ποιοι Είμαστε',
      headlineStart: 'Κάτι περισσότερο από',
      headlineAccent: 'ένα Car Club.',
      body: `Το Hondaunit ξεκίνησε το 2018 ως μια παρέα φίλων και εξελίχθηκε σε παγκόσμιο κίνημα. Τιμούμε την κληρονομιά του Soichiro Honda σε κάθε πλαίσιο, από EF μέχρι FL5.

Πιστεύουμε στον σεβασμό, στα builds ποιότητας και στο να οδηγούμε τα αυτοκίνητα όπως σχεδιάστηκαν. Είτε τρέχεις ένα S2000 στην πίστα είτε ανακατασκευάζεις ένα κλασικό CRX, εδώ ανήκεις.`,
      features: [
        {
          title: 'Η Κοινότητα',
          description: 'Ένα δίκτυο ενθουσιωδών που τους ενώνει η εμμονή για τέλεια μηχανική.'
        },
        {
          title: 'Η Τέχνη',
          description: 'Δεν οδηγούμε απλώς· χτίζουμε. Κάθε βίδα είναι δήλωση αφοσίωσης.'
        },
        {
          title: 'Η Κουλτούρα',
          description: 'Από τις νυχτερινές βόλτες μέχρι τα σόου, εκπροσωπούμε το αυθεντικό JDM.'
        }
      ]
    },
    worldMap: {
      eyebrow: 'Παγκόσμια Παρουσία',
      headline: 'Οικουμενική ',
      headlineAccent: 'Κυριαρχία',
      description: 'Από τις λεωφόρους του Τόκιο μέχρι τα φαράγγια του LA. Εκεί που ξυπνά το VTEC, είμαστε παρόντες.'
    },
    gallery: {
      eyebrow: 'Οπτικό Ημερολόγιο',
      titleStart: 'Τα',
      titleAccent: 'Αρχεία',
      subtitle: 'Επιλεγμένες Λήψεις 2024-2025'
    },
    breakingBanner: {
      text: 'HONDAUNIT /// Η ΚΛΗΡΟΝΟΜΙΑ /// ΑΠΟ ΤΟ 2018 ///'
    },
    members: {
      eyebrow: 'Η Ομάδα',
      headlineStart: 'Επίσημη',
      headlineAccent: 'Λίστα',
      description: 'Γνώρισε την κοινότητα HondaUnit. Πάτησε σε οποιονδήποτε οδηγό για να δεις το προφίλ του.',
      searchPlaceholder: 'Αναζήτηση με όνομα, instagram ή μηχανή...',
      loading: 'Φόρτωση μελών...',
      emptyMessage: (query: string) => `Δεν βρέθηκαν μέλη με "${query}"`,
      table: {
        driver: 'Οδηγός',
        machine: 'Μηχανή',
        location: 'Περιοχή',
        age: 'Ηλικία',
        showing: (start, end, total) => `Προβολή ${start}-${end} από ${total} μέλη`
      }
    },
    events: {
      eyebrow: 'Ημερολόγιο',
      headlineStart: 'Επόμενα',
      headlineAccent: 'Meets',
      empty: 'Δεν υπάρχουν προσεχείς events. Μείνε συντονισμένος!',
      toBeAnnounced: 'Θα ανακοινωθεί',
      modalTitle: 'Λεπτομέρειες Event',
      modalEndsLabel: 'Λήξη',
      buttonDefault: 'Δες λεπτομέρειες',
      buttonRsvped: 'Δες λεπτομέρειες',
      errorFallback: 'Αποτυχία φόρτωσης events'
    },
    contact: {
      eyebrow: 'Μπες στο Crew',
      headlineStart: 'Χτίσε τη',
      headlineAccent: 'Κληρονομιά σου',
      description: `Έχεις build που πρέπει να φανεί; Θέλεις συνεργασία ή χορηγία; Επικοινώνησε μαζί μας.
Ψάχνουμε συνεχώς για τα πιο καθαρά chassis και τους πιο αφοσιωμένους builders.`,
      emailLabel: 'Email',
      emailValue: 'info@hondaunit.com',
      instagramLabel: 'Instagram',
      instagramHandle: '@hondaunit',
      form: {
        nameLabel: 'Όνομα',
        namePlaceholder: 'Drift King',
        handleLabel: 'IG Handle',
        handlePlaceholder: '@username',
        emailLabel: 'Email',
        emailPlaceholder: 'driver@example.com',
        messageLabel: 'Μήνυμα',
        messagePlaceholder: 'Πες μας για το build σου...',
        messageMinNote: (min: number) => `Ελάχιστο ${min} χαρακτήρες`,
        messageTooShort: (min: number) => `Γράψε τουλάχιστον ${min} χαρακτήρες πριν στείλεις.`,
        submitIdle: 'Στείλε μήνυμα',
        submitSubmitting: 'Αποστολή...',
        submitSuccess: 'Εστάλη',
        submitError: 'Ξανά',
        successMessage: 'Το λάβαμε! Έλεγξε το inbox για επιβεβαίωση.',
        genericError: 'Κάτι πήγε στραβά. Προσπάθησε ξανά σε λίγο.'
      }
    },
    footer: {
      rights: '© 2025 Κοινότητα Hondaunit. Με επιφύλαξη παντός δικαιώματος.',
      poweredByPrefix: 'Powered by',
      poweredByName: 'DevMonix Technologies',
      links: {
        decals: 'Κατάστημα Decal',
        customCars: 'Custom Build Cars',
        home: 'Αρχική'
      }
    }
  }
};
