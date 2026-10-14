/** All marketing copy lives here so layout components stay free of strings. */

export const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Features', href: '#features' },
  { label: 'Premium', href: '#premium' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
] as const

export const hero = {
  lines: ['Stop Guessing', 'Where Your Money Goes.'],
  body: 'Track expenses, understand your spending, and make better money decisions with Zeno.',
  primary: 'Join the Waitlist',
  secondary: 'Explore Zeno',
}

export const overview = {
  title: 'Money, Made Simple',
  expense: {
    title: 'Expense tracking',
    body: 'Log what you spend in seconds with Quick Add and keep every rupee in one place.',
  },
  budgets: {
    title: 'Budgets & limits',
    body: 'Set a monthly budget, watch your burn rate and see what is left.',
  },
  ai: {
    title: 'Zeno AI',
    body: 'Ask about your spending in plain words and get clear, simple answers.',
  },
}

export type ShowcaseScreen = 'home' | 'budget' | 'ai'

export const showcase: { title: string; screen: ShowcaseScreen; icon: 'zap' | 'target' | 'chart' | 'sparkle' }[] = [
  { title: 'Track every rupee without the friction.', screen: 'home', icon: 'zap' },
  { title: 'Set limits and watch your burn rate.', screen: 'budget', icon: 'target' },
  { title: 'See exactly where your money goes.', screen: 'budget', icon: 'chart' },
  { title: 'Ask Zeno before you spend.', screen: 'ai', icon: 'sparkle' },
]

export const benefits = {
  title: 'Your Money, Made Simpler',
  body: 'Log in seconds, see the full picture, and build habits that stick — without spreadsheets or guesswork.',
  cta: 'Join the Waitlist',
  slides: [
    {
      title: 'Less friction.',
      body: 'Track expenses with less friction — add a spend in a few taps and get back to your day.',
    },
    {
      title: 'See where it goes.',
      body: 'Every category, every month, in one clear view so nothing slips past unnoticed.',
    },
    {
      title: 'Understand your patterns.',
      body: 'Zeno AI helps you read your spending, check what you can afford and find places to save.',
    },
    {
      title: 'Build steadier habits.',
      body: 'Budgets and limits keep you honest, so good money habits become consistent ones.',
    },
  ],
}

export const premium = {
  eyebrow: 'Zeno Premium · planned',
  title: 'A Clearer Picture of Your Money.',
  body: 'Explore deeper insights and smarter tools to understand your spending. Zeno Premium is still being shaped — register your interest and be first to hear when it is ready.',
  items: [
    { title: 'Deeper insights', body: 'Planned: richer breakdowns of where your money goes.', icon: 'chart' as const },
    { title: 'Smarter tools', body: 'Planned: more help from Zeno AI when you plan and save.', icon: 'sparkle' as const },
  ],
  cta: 'Register interest',
}

export const faqs = [
  {
    q: 'What is Zeno?',
    a: 'Zeno is a personal expense-tracking app. It helps you log what you spend, set budgets and understand where your money goes, with an AI assistant — Zeno AI — you can ask about your finances.',
  },
  {
    q: 'How does expense tracking work?',
    a: 'You add expenses with Quick Add and give each one a category. Zeno groups them into budgets and insights so you can see your spending by category and across the month.',
  },
  {
    q: 'What does Zeno AI do?',
    a: 'Zeno AI is the in-app assistant. You can ask questions such as “Where did my money go this month?”, check whether you can afford something, or ask for saving tips.',
  },
  {
    q: 'Does Zeno require special permissions?',
    a: 'Permission requirements depend on which features you use. We will list exactly which permissions each feature needs, and why, before the beta opens.',
  },
  {
    q: 'What information is stored locally?',
    a: 'Zeno’s finance assistant runs on a local AI engine inside the app. A full breakdown of what is stored on your device, and what if anything leaves it, will be published in the privacy policy before launch.',
  },
  {
    q: 'Is Zeno available on iOS?',
    a: 'Zeno is being built for Android first. There is no iOS release date yet — join the waitlist and we will let you know if that changes.',
  },
  {
    q: 'How can I join the beta?',
    a: 'Join the waitlist with your email. We will write to you when beta access opens.',
  },
  {
    q: 'Which features are still in development?',
    a: 'Zeno Premium and Smart Auto-Track are still in development, so details may change before release. Nothing marked as planned on this page is available today.',
  },
]

export const finalCta = {
  eyebrow: 'Ready to take control?',
  title: 'Spend with clarity.',
  body: 'Join the waitlist for early access to Zeno and be among the first to try it.',
}

export const footer = {
  company: [
    { label: 'Home', href: '#top' },
    { label: 'Features', href: '#features' },
    { label: 'Premium', href: '#premium' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
}

export const goals = [
  'Tracking my expenses',
  'Sticking to a budget',
  'Understanding my spending habits',
  'Saving more',
  'Something else',
]
