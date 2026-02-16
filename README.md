# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Requirements
IMPORTANT ASSUMUPTION, AUTH HAS BEEN OMITTED
The brief
You are working as a Forward-Deployed Engineer with another Heidi customer:

Harbour to Sunset GP, a multi-location clinic with high inbound call volume and limited front desk capacity.

Heidi Calls provides after-hours coverage and call handling for clinics, including voicemail when live handling isn’t possible. Today, Harbour relies heavily on voicemail overnight and during peak hours.

The problem is what happens next.

Each morning, admin staff arrive to:

dozens of long, unstructured voicemail recordings
no clear sense of urgency or intent
no easy way to prioritise or track follow-ups
Before the day even starts, they are already behind.

This is not an audio problem.

It’s a workflow and information problem.

Your task
Design and prototype an intelligent voicemail system within Heidi Calls that turns missed calls into structured, actionable work for clinic staff.

As a Forward-Deployed Engineer, your goal is to:

understand how admin staff actually process voicemails
reduce listening, context switching, and manual triage
surface the right information at the right time
Your system should:

extract intent, urgency, and key details from voicemails
summarise what matters, not everything
make next steps obvious and trackable
Required deliverables
1. A runnable or clickable prototype showing:

a voicemail inbox or dashboard
each voicemail represented as a structured item
prioritisation or triage signals
basic management actions (e.g. status, next step)
2. A short walkthrough (video or voiceover) explaining:

how raw voicemails become actionable items
what is automated vs left to humans
how this fits into a busy clinic’s morning workflow
You may use assumed transcripts, mock voicemails, or synthetic data to demonstrate behaviour.

Assumptions
This is primarily an after-hours or overflow use case
Admin staff are time-poor and frequently interrupted
Some human judgment will always remain
Constraints
Design polish does not matter
Do not rely on staff listening to full recordings
Optimise for clarity, speed, and trust
You may assume transcripts and basic metadata exist
What we’re evaluating
Your ability to turn unstructured input into usable work
Judgment around prioritisation and failure cases
Whether this would realistically help a real clinic
Whether the system feels calm under load
Do not explain what you would build.

Build something real, as if you were already deployed with the customer.