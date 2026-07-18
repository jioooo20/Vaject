export const personalData = {
  name: 'Giovano Alkandri',
  role: 'Fullstack Engineer',
  tagline: 'Backend-focused developer with a growing passion for DevOps',
  taglineExtended: 'Building scalable backends, crafting clean APIs, and learning to secure them all.',
  email: 'giovanoalkandri@gmail.com',
  linkedin: 'https://www.linkedin.com/in/giovano-alkandri-a4009b252/',
  github: 'https://github.com/jioooo20',
  resumeUrl: '/cv/cv-giovano-alkandri.pdf',
  bio: [
    'A passionate fullstack engineer with a strong foundation in backend development using Laravel, Express, and NestJS. Experienced in building scalable web applications and RESTful APIs with various database systems.',
    'Currently expanding expertise into DevOps — integrating security practices into the development lifecycle. Proficient in Linux server administration (Debian/Ubuntu), basic networking, and containerization.',
    'Always eager to learn new technologies and solve real-world problems through clean, maintainable code.',
  ],
}

export const skills = [
  {
    category: 'Frontend',
    items: ['React', 'Laravel Blade', 'Tailwind CSS', 'Bootstrap', 'Vue'],
  },
  {
    category: 'Backend',
    items: ['Laravel', 'Express', 'NestJS'],
  },
  {
    category: 'Database',
    items: ['MariaDB', 'MySQL', 'PostgreSQL', 'SQL Server'],
  },
  {
    category: 'DevOps & Tools',
    items: ['Linux (Debian/Ubuntu)', 'Docker', 'Networking (Mikrotik/Cisco)', 'Git'],
  },
]

export const experiences = [
  {
    role: 'Web Developer Intern',
    company: 'PT Multi Spunindo Jaya Tbk',
    location: 'Sidoarjo, Indonesia',
    period: 'Jan 2026 - Present',
    type: 'Internship',
    descriptions: [
      'Developing and maintaining web-based applications for internal business processes',
      'Collaborating with cross-functional teams to deliver software solutions',
      'Implementing RESTful APIs and database integration using modern frameworks',
    ],
  },
  {
    role: 'Teknisi Intern',
    company: 'PT Intidata Telematika',
    location: 'Surabaya, Indonesia',
    period: 'Jun 2022 - Nov 2022',
    type: 'Internship',
    descriptions: [
      'Performed hardware and software maintenance for client systems',
      'Assisted in network troubleshooting and configuration',
      'Provided technical support and documentation for IT infrastructure',
    ],
  },
]

export const education = [
  {
    school: 'Politeknik Negeri Malang',
    degree: 'D4 Teknik Informatika',
    period: '2023 - Present',
    description: 'Focusing on software engineering, web development, and information systems.',
  },
  {
    school: 'SMK Telkom Malang',
    degree: 'Teknik Komputer dan Jaringan',
    period: '2020 - 2023',
    description: 'Vocational high school specializing in computer and network engineering (TKJ).',
  },
]

export const projects = [
  {
    title: 'Simpelfas',
    description:
      'Campus facility damage reporting and repair tracking system. Simplifies the process for students, lecturers, and staff to report and monitor facility maintenance.',
    tech: ['Laravel', 'MySQL', 'Blade', 'Bootstrap'],
    github: 'https://github.com/jioooo20/simpelfas',
    image: 'https://placehold.co/600x400/14b8a6/ffffff?text=Simpelfas',
    stars: 3,
  },
  {
    title: 'SIREPANG',
    description:
      'Food recall monitoring system for the Indonesian Food Security Agency. Tracks food safety development and recall events across Malang region.',
    tech: ['Laravel', 'MySQL', 'Tailwind', 'PHP'],
    github: 'https://github.com/a6iyyu/sirepang',
    image: 'https://placehold.co/600x400/0d9488/ffffff?text=SIREPANG',
  },
  {
    title: 'PWL 2025 — Point of Sales',
    description:
      'A Point of Sales web application built with React frontend and Express backend for managing sales transactions.',
    tech: ['React', 'Express', 'MySQL', 'JavaScript'],
    github: 'https://github.com/jioooo20/PWL_2025',
    image: 'https://placehold.co/600x400/0891b2/ffffff?text=PWL+POS',
  },
  {
    title: 'Minilog',
    description:
      'Minimal logging system for tracking and monitoring application events and errors across distributed services.',
    tech: ['Vue', 'Node.js', 'JavaScript'],
    github: 'https://github.com/jioooo20/minilog',
    image: 'https://placehold.co/600x400/7c3aed/ffffff?text=Minilog',
  },
  {
    title: 'Fevastify',
    description:
      'A TypeScript-based project showcasing modern development practices, type-safe architecture, and clean code principles.',
    tech: ['TypeScript', 'Node.js'],
    github: 'https://github.com/jioooo20/fevastify',
    image: 'https://placehold.co/600x400/d97706/ffffff?text=Fevastify',
  },
  {
    title: 'Belibeli',
    description:
      'A Flutter-based mobile application built with Dart, demonstrating cross-platform development and modern UI patterns.',
    tech: ['Dart', 'Flutter'],
    github: 'https://github.com/jioooo20/belibeli',
    image: 'https://placehold.co/600x400/059669/ffffff?text=Belibeli',
  },
]

export const techColors = {
  React: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  'Laravel Blade': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  'Tailwind CSS': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  Tailwind: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  Bootstrap: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  Vue: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Laravel: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  Express: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  NestJS: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  MariaDB: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  MySQL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'SQL Server': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  PostgreSQL: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  'Linux (Debian/Ubuntu)': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  Docker: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Networking (Mikrotik/Cisco)': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  Git: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  Blade: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  PHP: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  JavaScript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  'Node.js': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  TypeScript: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Dart: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  Flutter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
}

export const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
]
