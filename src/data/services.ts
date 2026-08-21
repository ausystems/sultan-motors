
export interface ServiceCard {
  title: string
  description: string
  to?: string
}

export interface WhyUsPoint {
  title: string
  description: string
}

export interface ProcessStep {
  title: string
  description: string
}

export interface GalleryImage {
  caption?: string
}

export interface Faq {
  q: string
  a: string
}

export interface InternalLink {
  label: string
  to: string
  description: string
}

export interface DetailItem {
  title: string
  description: string
}

/** Optional numbered explainer block (e.g. "when do you need this?"). */
export interface DetailSection {
  eyebrow: string
  heading: string
  body?: string
  items: DetailItem[]
}

export interface ServiceConfig {
  slug: string
  eyebrow: string
  h1: string
  heroSubtitle: string
  heroImageAlt: string
  /** Hero primary button label. Defaults to "Book Your Repair". */
  heroCta?: string
  intro: {
    eyebrow: string
    heading: string
    body: string | string[]
    bullets: string[]
  }
  serviceCards: {
    heading: string
    subheading?: string
    cards: ServiceCard[]
  }
  whyUs: {
    heading: string
    points: WhyUsPoint[]
  }
  process: {
    heading: string
    steps: ProcessStep[]
  }
  brands?: {
    heading: string
    subheading?: string
    items: string[]
  }
  gallery?: {
    heading: string
    subheading?: string
    images: GalleryImage[]
  }
  /** Explainer grid rendered after the whyUs section. */
  whenYouNeed?: DetailSection
  /** Checklist grid rendered after the process section. */
  inspectChecklist?: DetailSection
  /** Long-form closing block rendered before the FAQ. */
  readyBlock?: {
    eyebrow: string
    heading: string
    paragraphs: string[]
  }
  /** Overrides the FAQ section heading. */
  faqHeading?: string
  /** Overrides the closing call-to-action copy. */
  cta?: {
    eyebrow: string
    heading: string
    body: string
  }
  faqs: Faq[]
  internalLinks: InternalLink[]
}

export const serviceConfigs: ServiceConfig[] = [
  {
    "slug": "auto-repair-brampton",
    "eyebrow": "AUTO REPAIR BRAMPTON",
    "h1": "AUTO REPAIR BRAMPTON TRUSTED BY LOCAL DRIVERS.",
    "heroSubtitle": "Serving Brampton drivers from our automotive repair facility at 5 Melanie Dr, Sultan Motors delivers precise diagnostics, mechanical repairs, maintenance, and collision support with a 20 year track record.",
    "heroImageAlt": "Sultan Motors auto repair shop in Brampton Ontario",
    "intro": {
      "eyebrow": "COMPLETE AUTO REPAIR SERVICES IN BRAMPTON",
      "heading": "One trusted shop for every repair your vehicle needs.",
      "body": "Sultan Motors is a full service auto repair shop in Brampton handling general repairs, mechanical work, computerized diagnostics, scheduled maintenance, and collision support. Our certified technicians work on domestic and import vehicles with OEM quality parts, warranty backed labour, and pricing that stays honest from quote to keys back.",
      "bullets": [
        "General and mechanical repairs for cars, SUVs, and light trucks",
        "Advanced computer diagnostics and drivability testing",
        "Preventative maintenance and manufacturer scheduled service",
        "Collision support with insurance friendly estimates"
      ]
    },
    "serviceCards": {
      "heading": "Our auto repair services in Brampton.",
      "subheading": "From a check engine light to a full mechanical rebuild, we cover every system that keeps your vehicle safe on Brampton roads.",
      "cards": [
        {
          "title": "Car Diagnostics",
          "description": "Computer scans, fault code testing, and root cause analysis for reliable repairs.",
          "to": "/car-diagnostics-brampton"
        },
        {
          "title": "Engine Repair",
          "description": "Misfire fixes, timing repairs, oil leaks, cooling systems, and complete rebuilds.",
          "to": "/engine-repair-brampton"
        },
        {
          "title": "Brake Repair",
          "description": "Pads, rotors, calipers, lines, and brake fluid service for confident stopping.",
          "to": "/brake-repair-brampton"
        },
        {
          "title": "Transmission Repair",
          "description": "Slipping, delayed shifts, fluid service, and full transmission rebuilds.",
          "to": "/transmission-repair-brampton"
        },
        {
          "title": "Suspension Repair",
          "description": "Shocks, struts, control arms, and steering work that restores ride quality.",
          "to": "/suspension-repair-brampton"
        },
        {
          "title": "Auto Electrical Repair",
          "description": "Batteries, alternators, sensors, and wiring diagnostics done right the first time.",
          "to": "/auto-electrical-repair-brampton"
        },
        {
          "title": "Car Maintenance",
          "description": "Oil services, fluid flushes, tune ups, and manufacturer scheduled maintenance.",
          "to": "/car-maintenance-brampton"
        },
        {
          "title": "Collision Repair",
          "description": "Structural work, frame straightening, and paint refinishing after any accident.",
          "to": "/collision-repair-brampton"
        },
        {
          "title": "Auto Body Repair",
          "description": "Dent repair, panel work, paint correction, and full body restoration.",
          "to": "/auto-body-repair-brampton"
        }
      ]
    },
    "whyUs": {
      "heading": "Why Brampton drivers choose Sultan Motors.",
      "points": [
        {
          "title": "20 plus years of experience",
          "description": "Two decades diagnosing and repairing vehicles across every major make and model on the road today."
        },
        {
          "title": "Certified technicians",
          "description": "Trained, tested, and continually updated on modern vehicle systems from hybrids to advanced driver assist."
        },
        {
          "title": "OEM quality parts",
          "description": "We fit original equipment and premium aftermarket parts so repairs last, and back them with a labour warranty."
        },
        {
          "title": "Transparent pricing",
          "description": "You approve every repair with a written quote before we start. No surprises, no invented add ons."
        },
        {
          "title": "Warranty backed work",
          "description": "Repairs come with a written warranty on parts and labour for long term peace of mind."
        }
      ]
    },
    "process": {
      "heading": "Our five step auto repair process.",
      "steps": [
        {
          "title": "Inspection",
          "description": "A full walk around and system check identifies the actual condition of your vehicle."
        },
        {
          "title": "Diagnosis",
          "description": "Computer scans and hands on testing isolate the true cause, not just the symptom."
        },
        {
          "title": "Estimate",
          "description": "You receive a written quote with parts, labour, and timeline before any work begins."
        },
        {
          "title": "Repair",
          "description": "Certified technicians complete the repair using OEM quality parts and torque spec."
        },
        {
          "title": "Delivery",
          "description": "A final quality check, road test, and clear explanation of what was fixed."
        }
      ]
    },
    "brands": {
      "heading": "We service every major brand.",
      "subheading": "Domestic, import, luxury, and daily driver. Our diagnostic tools and technician training cover them all.",
      "items": [
        "BMW",
        "Mercedes",
        "Toyota",
        "Honda",
        "Ford",
        "Audi",
        "Chevrolet",
        "Nissan",
        "Hyundai",
        "Volkswagen",
        "Kia",
        "Lexus"
      ]
    },
    "gallery": {
      "heading": "Inside the Brampton bay.",
      "images": [
        {
          "caption": "REPAIR BAY"
        },
        {
          "caption": "DIAGNOSTICS"
        },
        {
          "caption": "PRECISION TOOLS"
        }
      ]
    },
    "faqs": [
      {
        "q": "How much does auto repair cost in Brampton?",
        "a": "Costs depend on the vehicle, the failed system, and parts required. Every repair at Sultan Motors starts with a free written estimate so you see the exact parts and labour before approving the work."
      },
      {
        "q": "How long does vehicle repair take?",
        "a": "Most maintenance items and common repairs finish the same day. Larger mechanical or collision work can take several days and we confirm the timeline with you before starting."
      },
      {
        "q": "Do you service all makes and models?",
        "a": "Yes. Our technicians and diagnostic equipment cover domestic, import, luxury, and hybrid vehicles including BMW, Mercedes, Toyota, Honda, Ford, Audi, and more."
      },
      {
        "q": "Do you provide warranties on auto repair?",
        "a": "Every repair we perform is backed by a written warranty on parts and labour. Warranty terms are provided on your final invoice."
      }
    ],
    "internalLinks": [
      {
        "label": "Car Diagnostics Brampton",
        "to": "/car-diagnostics-brampton",
        "description": "Advanced scan tools that find the real cause."
      },
      {
        "label": "Engine Repair Brampton",
        "to": "/engine-repair-brampton",
        "description": "Complex mechanical work by trained engine specialists."
      },
      {
        "label": "Brake Repair Brampton",
        "to": "/brake-repair-brampton",
        "description": "Pads, rotors, and brake service for safe stopping."
      },
      {
        "label": "Car Maintenance Brampton",
        "to": "/car-maintenance-brampton",
        "description": "Manufacturer scheduled service that protects your warranty."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book your Brampton auto repair appointment today."
      }
    ]
  },
  {
    "slug": "car-diagnostics-brampton",
    "eyebrow": "CAR DIAGNOSTICS BRAMPTON",
    "h1": "CAR DIAGNOSTICS BRAMPTON FOR ACCURATE VEHICLE REPAIRS.",
    "heroSubtitle": "Sultan Motors uses professional grade scan tools and manufacturer data to trace check engine lights, electrical faults, and drivability problems on every make and model in Brampton.",
    "heroImageAlt": "Car diagnostics being performed at Sultan Motors Brampton",
    "intro": {
      "eyebrow": "ADVANCED VEHICLE DIAGNOSTICS",
      "heading": "The right diagnosis saves you time, money, and repeat repairs.",
      "body": "Modern vehicles are computer controlled from the powertrain to the door locks. Sultan Motors combines full system computer scanning, live data monitoring, and hands on electrical testing so we find the actual fault the first time instead of replacing parts on guesswork.",
      "bullets": [
        "Full system computer scanning including engine, transmission, ABS, airbag, and body modules",
        "Live data recording during real world driving conditions",
        "Electrical circuit testing with meters and oscilloscopes",
        "Manufacturer service information for accurate procedures"
      ]
    },
    "serviceCards": {
      "heading": "Problems we diagnose in Brampton.",
      "cards": [
        {
          "title": "Check Engine Lights",
          "description": "Full code read, freeze frame analysis, and root cause testing so the light stays off."
        },
        {
          "title": "Strange Noises",
          "description": "Whines, clunks, and rattles traced to the exact component with a road test and stethoscope work."
        },
        {
          "title": "Poor Acceleration",
          "description": "Fuel, ignition, sensor, and exhaust checks that restore your vehicle's power."
        },
        {
          "title": "Warning Lights",
          "description": "ABS, airbag, traction, and dash warning lights investigated across every module."
        },
        {
          "title": "Starting Problems",
          "description": "Battery, starter, ignition, and security system testing for cars that will not start."
        },
        {
          "title": "Electrical Failures",
          "description": "Short circuits, parasitic drains, and wiring faults found with proper equipment."
        }
      ]
    },
    "whyUs": {
      "heading": "Why accurate diagnosis matters.",
      "points": [
        {
          "title": "Prevent unnecessary repairs",
          "description": "A proper diagnosis stops the parts cannon before you pay for components you never needed."
        },
        {
          "title": "Save money long term",
          "description": "Fixing the real fault the first time avoids repeat visits and cascading damage to related systems."
        },
        {
          "title": "Find root causes",
          "description": "We chase the underlying issue, not just the code, so the same problem does not return next month."
        }
      ]
    },
    "process": {
      "heading": "Our diagnostic process.",
      "steps": [
        {
          "title": "Scan",
          "description": "Full vehicle computer scan across every module for stored and pending fault codes."
        },
        {
          "title": "Inspect",
          "description": "Visual and hands on inspection of the systems flagged by the scan data."
        },
        {
          "title": "Test",
          "description": "Component level testing with meters, scopes, and manufacturer procedures."
        },
        {
          "title": "Recommend",
          "description": "A written repair recommendation with priority, cost, and timeline before any work begins."
        }
      ]
    },
    "brands": {
      "heading": "Diagnostic coverage across every brand.",
      "items": [
        "BMW",
        "Mercedes",
        "Toyota",
        "Honda",
        "Ford",
        "Audi",
        "Chevrolet",
        "Nissan"
      ]
    },
    "gallery": {
      "heading": "Diagnostic work at Sultan Motors.",
      "images": [
        {
          "caption": "OBD SCAN"
        },
        {
          "caption": "LIVE DATA"
        },
        {
          "caption": "TEST BAY"
        }
      ]
    },
    "faqs": [
      {
        "q": "Why is my check engine light on?",
        "a": "A check engine light can point to anything from a loose gas cap to a failing catalytic converter. Sultan Motors reads the fault codes, checks live data, and inspects the flagged system so you know the exact cause before spending on parts."
      },
      {
        "q": "How much does vehicle diagnosis cost in Brampton?",
        "a": "Basic code reads are quick and inexpensive. Deeper drivability, electrical, or intermittent fault diagnosis is quoted based on the time required, and we always confirm the price with you first."
      },
      {
        "q": "Can diagnostics find all problems?",
        "a": "Computer scans identify most electronic faults and many mechanical issues, but some problems require hands on inspection and road testing. Our process combines both so nothing hides."
      }
    ],
    "internalLinks": [
      {
        "label": "Auto Repair Brampton",
        "to": "/auto-repair-brampton",
        "description": "The complete Sultan Motors repair overview."
      },
      {
        "label": "Engine Repair Brampton",
        "to": "/engine-repair-brampton",
        "description": "For confirmed engine faults that need mechanical repair."
      },
      {
        "label": "Auto Electrical Repair Brampton",
        "to": "/auto-electrical-repair-brampton",
        "description": "Battery, alternator, and wiring diagnostics."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book a diagnostic appointment in Brampton."
      }
    ]
  },
  {
    "slug": "engine-repair-brampton",
    "eyebrow": "ENGINE REPAIR BRAMPTON",
    "h1": "ENGINE REPAIR BRAMPTON BY EXPERIENCED MECHANICS.",
    "heroSubtitle": "Sultan Motors handles engine diagnostics, mechanical repairs, timing work, and complete engine replacement for Brampton drivers who need honest expert answers.",
    "heroImageAlt": "Engine repair in progress at Sultan Motors Brampton",
    "intro": {
      "eyebrow": "ENGINE MECHANIC BRAMPTON",
      "heading": "Engine problems solved by mechanics who have seen it all.",
      "body": "From modern turbocharged four cylinders to high mileage V6 and V8 engines, our team diagnoses, repairs, and rebuilds engines across every brand. We use manufacturer torque specs, quality gaskets, and OEM level parts so your repair holds up long after you leave the bay.",
      "bullets": [
        "Complete engine diagnostics with live data and compression testing",
        "Timing chain, belt, and tensioner repairs",
        "Head gasket, valve cover, and oil leak repairs",
        "Long block replacement and full engine rebuilds"
      ]
    },
    "serviceCards": {
      "heading": "Engine problems we repair.",
      "cards": [
        {
          "title": "Misfires",
          "description": "Ignition, fuel, and mechanical misfire diagnosis with permanent repair, not guesswork."
        },
        {
          "title": "Oil Leaks",
          "description": "Valve cover, oil pan, rear main, and timing cover leaks properly sealed."
        },
        {
          "title": "Overheating",
          "description": "Cooling system testing, water pumps, thermostats, and radiator replacement."
        },
        {
          "title": "Timing Problems",
          "description": "Timing chain and belt replacement done to manufacturer specification."
        },
        {
          "title": "Performance Issues",
          "description": "Sluggish acceleration, rough idle, and stalling traced to the exact cause."
        },
        {
          "title": "Engine Replacement",
          "description": "Long block replacement, remanufactured engines, and complete rebuild service."
        }
      ]
    },
    "whyUs": {
      "heading": "Signs your engine needs repair.",
      "points": [
        {
          "title": "Strange noises",
          "description": "Knocks, ticks, and rattles from the engine bay should always be inspected before damage spreads."
        },
        {
          "title": "Smoke from the exhaust",
          "description": "Blue, white, or black smoke each points to different internal issues that need attention."
        },
        {
          "title": "Loss of power",
          "description": "A vehicle that feels sluggish or hesitates under load is telling you something is wrong."
        },
        {
          "title": "Warning lights",
          "description": "Check engine, oil pressure, and temperature warnings should never be ignored."
        }
      ]
    },
    "process": {
      "heading": "Our engine repair process.",
      "steps": [
        {
          "title": "Inspect",
          "description": "Full visual and mechanical inspection of the engine and its supporting systems."
        },
        {
          "title": "Diagnose",
          "description": "Scan tools, compression tests, and leak down tests to confirm internal condition."
        },
        {
          "title": "Estimate",
          "description": "Written quote with clear scope, parts, labour, and timeline."
        },
        {
          "title": "Repair",
          "description": "Repairs performed to manufacturer torque and clearance specifications."
        },
        {
          "title": "Verify",
          "description": "Post repair scan, road test, and quality check before you drive away."
        }
      ]
    },
    "brands": {
      "heading": "Engine repair across every brand.",
      "items": [
        "BMW",
        "Mercedes",
        "Toyota",
        "Honda",
        "Ford",
        "Audi",
        "Chevrolet",
        "Nissan"
      ]
    },
    "gallery": {
      "heading": "Engine work at Sultan Motors.",
      "images": [
        {
          "caption": "ENGINE BAY"
        },
        {
          "caption": "PRECISION TORQUE"
        },
        {
          "caption": "REPAIR BAY"
        }
      ]
    },
    "faqs": [
      {
        "q": "How much does engine repair cost in Brampton?",
        "a": "Minor repairs like coil packs or valve cover gaskets are usually a few hundred dollars, while timing work and engine replacement can be significant. Every job starts with a written quote at Sultan Motors."
      },
      {
        "q": "How long does engine repair take?",
        "a": "Simple engine repairs finish the same day. Timing jobs and engine replacements can take several days depending on parts availability and the complexity of your vehicle."
      },
      {
        "q": "Is engine replacement worth it?",
        "a": "It often is. A quality remanufactured engine can add many years of reliable driving for a fraction of the cost of a new vehicle. We help you weigh the numbers honestly."
      }
    ],
    "internalLinks": [
      {
        "label": "Car Diagnostics Brampton",
        "to": "/car-diagnostics-brampton",
        "description": "Find engine faults before replacing parts."
      },
      {
        "label": "Auto Repair Brampton",
        "to": "/auto-repair-brampton",
        "description": "Full Sultan Motors service overview."
      },
      {
        "label": "Car Maintenance Brampton",
        "to": "/car-maintenance-brampton",
        "description": "Prevent engine problems with scheduled care."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book your engine repair appointment."
      }
    ]
  },
  {
    "slug": "brake-repair-brampton",
    "eyebrow": "BRAKE REPAIR BRAMPTON",
    "h1": "BRAKE REPAIR BRAMPTON YOU CAN STOP ON.",
    "heroSubtitle": "Sultan Motors delivers full brake repair in Brampton including inspections, pad and rotor replacement, calipers, brake fluid service, and complete brake system overhauls.",
    "heroImageAlt": "Brake repair being performed at Sultan Motors Brampton",
    "intro": {
      "eyebrow": "BRAKE SHOP BRAMPTON",
      "heading": "Brakes fixed right the first time.",
      "body": "Brake work is safety work. We inspect the entire brake system, measure rotor thickness, check pad wear, test the fluid, and only recommend the parts your vehicle actually needs. Every brake job at Sultan Motors is torqued to spec and road tested before you drive home.",
      "bullets": [
        "Front and rear brake pad replacement",
        "Rotor resurfacing and replacement",
        "Caliper repair and replacement",
        "Brake fluid flush and hydraulic system service"
      ]
    },
    "serviceCards": {
      "heading": "Brake problems we fix in Brampton.",
      "cards": [
        {
          "title": "Grinding Brakes",
          "description": "Metal on metal grinding means pads are gone and rotors are being damaged. Fix it fast."
        },
        {
          "title": "Squeaking Brakes",
          "description": "Squeal often signals worn pads. We inspect and replace with quiet quality pads."
        },
        {
          "title": "Vibrations",
          "description": "A pulsing pedal or steering wheel points to warped rotors or a hydraulic issue."
        },
        {
          "title": "Soft Pedal",
          "description": "A brake pedal that sinks means air, fluid loss, or a failing master cylinder."
        },
        {
          "title": "Pulling to One Side",
          "description": "Uneven braking traced to a stuck caliper, collapsed hose, or worn pad."
        },
        {
          "title": "Warning Lights",
          "description": "Brake and ABS warning lights fully diagnosed across every module."
        }
      ]
    },
    "whyUs": {
      "heading": "Why brakes matter more than any other repair.",
      "points": [
        {
          "title": "Stopping is not optional",
          "description": "Every other repair can wait. Brakes cannot. If something feels off, do not ignore it."
        },
        {
          "title": "Small repairs stay small",
          "description": "Replacing pads early saves rotors. Servicing fluid early saves calipers and lines."
        },
        {
          "title": "Quality parts, not bargain bin",
          "description": "We fit premium and OEM pads and rotors so your brakes are quiet, strong, and durable."
        }
      ]
    },
    "process": {
      "heading": "Our brake inspection process.",
      "steps": [
        {
          "title": "Road Test",
          "description": "We drive your vehicle to feel exactly what you are describing."
        },
        {
          "title": "Wheels Off",
          "description": "Full visual inspection of pads, rotors, calipers, hoses, and hardware."
        },
        {
          "title": "Measure",
          "description": "Pad thickness and rotor spec are measured against manufacturer minimums."
        },
        {
          "title": "Recommend",
          "description": "Clear written quote with priority ranked recommendations."
        },
        {
          "title": "Repair",
          "description": "Parts replaced, hardware serviced, fluid checked, and torque verified."
        }
      ]
    },
    "brands": {
      "heading": "Brake service on every make.",
      "items": [
        "BMW",
        "Mercedes",
        "Toyota",
        "Honda",
        "Ford",
        "Audi",
        "Chevrolet",
        "Nissan"
      ]
    },
    "gallery": {
      "heading": "Brake work at Sultan Motors.",
      "images": [
        {
          "caption": "PADS AND ROTORS"
        },
        {
          "caption": "PRECISION"
        },
        {
          "caption": "BAY"
        }
      ]
    },
    "faqs": [
      {
        "q": "How much does brake repair cost in Brampton?",
        "a": "A standard pad and rotor replacement typically ranges based on the vehicle and parts quality. Sultan Motors provides a written estimate after inspection so you know the price up front."
      },
      {
        "q": "How long do brake pads last?",
        "a": "Most drivers see 40,000 to 80,000 kilometres from a set of pads depending on driving style, traffic, and pad quality. We check pad life at every service."
      },
      {
        "q": "Can I drive with worn brakes?",
        "a": "It is not safe. Worn pads damage rotors, extend stopping distance, and can lead to hydraulic failure. Get a free inspection at Sultan Motors before it becomes a bigger repair."
      }
    ],
    "internalLinks": [
      {
        "label": "Auto Repair Brampton",
        "to": "/auto-repair-brampton",
        "description": "See the full Sultan Motors repair menu."
      },
      {
        "label": "Suspension Repair Brampton",
        "to": "/suspension-repair-brampton",
        "description": "Struts and shocks that affect braking distance."
      },
      {
        "label": "Car Maintenance Brampton",
        "to": "/car-maintenance-brampton",
        "description": "Scheduled service that keeps brakes healthy."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book a Brampton brake inspection."
      }
    ]
  },
  {
    "slug": "car-maintenance-brampton",
    "eyebrow": "CAR MAINTENANCE BRAMPTON",
    "h1": "CAR MAINTENANCE BRAMPTON THAT PROTECTS YOUR INVESTMENT.",
    "heroSubtitle": "Sultan Motors delivers scheduled maintenance, oil services, fluid checks, and tune ups that follow every manufacturer schedule for cars, SUVs, and trucks in Brampton.",
    "heroImageAlt": "Car maintenance Brampton at Sultan Motors",
    "intro": {
      "eyebrow": "SCHEDULED MAINTENANCE BRAMPTON",
      "heading": "The easiest repair is the one you never need.",
      "body": "Regular maintenance is the single best thing you can do for your vehicle's reliability, safety, and resale value. Sultan Motors follows manufacturer intervals and inspects the full vehicle at every visit so small issues get caught before they become expensive.",
      "bullets": [
        "Manufacturer scheduled service that preserves your warranty",
        "Full synthetic and conventional oil change options",
        "Fluid checks and flushes for coolant, brake, transmission, and power steering",
        "Multi point inspection with every service"
      ]
    },
    "serviceCards": {
      "heading": "Complete vehicle maintenance in Brampton.",
      "cards": [
        {
          "title": "Oil and Filter Service",
          "description": "Full synthetic and conventional options with a fresh OEM quality filter every time."
        },
        {
          "title": "Fluid Checks and Flushes",
          "description": "Coolant, brake, transmission, and power steering fluids inspected and serviced."
        },
        {
          "title": "Tune Ups",
          "description": "Spark plugs, ignition coils, and air filters replaced on manufacturer intervals."
        },
        {
          "title": "Tire Rotations",
          "description": "Even wear rotations that extend tire life and improve handling."
        },
        {
          "title": "Battery Testing",
          "description": "Load testing and terminal service so your vehicle starts every morning."
        },
        {
          "title": "Preventative Inspection",
          "description": "Full vehicle walk around that catches issues before they strand you."
        }
      ]
    },
    "whyUs": {
      "heading": "Maintenance built around your manufacturer schedule.",
      "points": [
        {
          "title": "OEM intervals",
          "description": "We follow the exact service intervals your manufacturer publishes for your model year and mileage."
        },
        {
          "title": "Warranty safe",
          "description": "Service records at Sultan Motors keep your factory warranty valid and your resale value strong."
        },
        {
          "title": "Free inspections",
          "description": "Every maintenance visit includes a complimentary multi point inspection with photos when needed."
        }
      ]
    },
    "process": {
      "heading": "Our maintenance workflow.",
      "steps": [
        {
          "title": "Review",
          "description": "We check your service history and manufacturer schedule for your exact vehicle."
        },
        {
          "title": "Service",
          "description": "The maintenance items due today are performed with OEM quality parts and fluids."
        },
        {
          "title": "Inspect",
          "description": "A full vehicle inspection catches wear before it becomes failure."
        },
        {
          "title": "Report",
          "description": "You receive a clear report of what was done and what is coming up next."
        },
        {
          "title": "Record",
          "description": "Digital records support your warranty and resale value."
        }
      ]
    },
    "gallery": {
      "heading": "Maintenance at Sultan Motors.",
      "images": [
        {
          "caption": "MAINTENANCE BAY"
        },
        {
          "caption": "PRECISION"
        },
        {
          "caption": "INSPECTION"
        }
      ]
    },
    "faqs": [
      {
        "q": "How often should I service my car?",
        "a": "Most modern vehicles need an oil service every 8,000 to 16,000 kilometres depending on the oil type and your manufacturer's recommendation. Larger inspections happen at 30,000, 60,000, and 90,000 kilometre intervals."
      },
      {
        "q": "What maintenance does my vehicle need right now?",
        "a": "Bring your car to Sultan Motors with your VIN and current mileage. We look up your exact manufacturer schedule and tell you what is due today and what is coming next."
      },
      {
        "q": "Does maintenance really save money?",
        "a": "Yes. A timely fluid flush or belt replacement is a fraction of the cost of the failure it prevents. Regular maintenance is the cheapest way to keep a car reliable."
      }
    ],
    "internalLinks": [
      {
        "label": "Auto Repair Brampton",
        "to": "/auto-repair-brampton",
        "description": "See every service Sultan Motors offers."
      },
      {
        "label": "Engine Repair Brampton",
        "to": "/engine-repair-brampton",
        "description": "Larger mechanical work when needed."
      },
      {
        "label": "Brake Repair Brampton",
        "to": "/brake-repair-brampton",
        "description": "Brake service that pairs with your maintenance."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book your next maintenance visit."
      }
    ]
  },
  {
    "slug": "transmission-repair-brampton",
    "eyebrow": "TRANSMISSION REPAIR BRAMPTON",
    "h1": "TRANSMISSION REPAIR BRAMPTON DONE PROPERLY.",
    "heroSubtitle": "Sultan Motors diagnoses and repairs automatic, manual, CVT, and dual clutch transmissions with the equipment, training, and honesty Brampton drivers deserve.",
    "heroImageAlt": "Transmission repair Brampton at Sultan Motors",
    "intro": {
      "eyebrow": "TRANSMISSION MECHANIC BRAMPTON",
      "heading": "The right transmission diagnosis before any teardown.",
      "body": "Transmission problems are often misdiagnosed and over sold. Sultan Motors performs a full diagnostic scan, fluid inspection, and road test before recommending anything, so you never pay for a rebuild when a service or a solenoid was the real answer.",
      "bullets": [
        "Automatic, manual, CVT, and dual clutch experience",
        "Transmission fluid and filter service",
        "Solenoid, valve body, and internal component repair",
        "Full transmission rebuilds and remanufactured replacements"
      ]
    },
    "serviceCards": {
      "heading": "Transmission problems we solve.",
      "cards": [
        {
          "title": "Slipping Gears",
          "description": "Loss of drive under acceleration diagnosed through pressure and scan testing."
        },
        {
          "title": "Delayed Shifting",
          "description": "Late or harsh shifts investigated at the valve body, solenoid, and computer level."
        },
        {
          "title": "Strange Noises",
          "description": "Whines, clunks, and grinding traced to bearings, planetaries, or driveline components."
        },
        {
          "title": "Fluid Leaks",
          "description": "Pan gaskets, seals, and cooler line leaks fixed before internal damage sets in."
        },
        {
          "title": "Warning Lights",
          "description": "Transmission warning lights read across every module for a real diagnosis."
        },
        {
          "title": "No Reverse or Drive",
          "description": "Complete loss of a gear inspected internally with a written repair plan."
        }
      ]
    },
    "whyUs": {
      "heading": "Transmission signs you should not ignore.",
      "points": [
        {
          "title": "Slipping under load",
          "description": "RPM climbs but speed does not follow. Get it inspected before internal damage grows."
        },
        {
          "title": "Delayed engagement",
          "description": "A pause when shifting into drive or reverse often points to fluid or valve body issues."
        },
        {
          "title": "Burnt fluid smell",
          "description": "Dark, burnt smelling transmission fluid signals overheating and internal wear."
        }
      ]
    },
    "process": {
      "heading": "Our transmission process.",
      "steps": [
        {
          "title": "Scan",
          "description": "Full computer scan and live data analysis of the transmission control module."
        },
        {
          "title": "Inspect",
          "description": "Fluid condition, pan inspection, and external leak check."
        },
        {
          "title": "Road Test",
          "description": "Real world testing to feel exactly what your transmission is doing."
        },
        {
          "title": "Recommend",
          "description": "Written quote with the true scope of repair before any teardown."
        },
        {
          "title": "Repair",
          "description": "Repairs done to spec with proper fluid, filter, and pressure setting."
        }
      ]
    },
    "gallery": {
      "heading": "Transmission work.",
      "images": [
        {
          "caption": "REPAIR BAY"
        },
        {
          "caption": "DIAGNOSTICS"
        },
        {
          "caption": "WORKSHOP"
        }
      ]
    },
    "faqs": [
      {
        "q": "How much does transmission repair cost in Brampton?",
        "a": "A fluid service is affordable, valve body and solenoid work is mid range, and a full rebuild is significant. Sultan Motors gives you a written quote after diagnosis so you can decide with clarity."
      },
      {
        "q": "Can transmission problems be fixed without a rebuild?",
        "a": "Very often, yes. Many transmission complaints are solved with a fluid service, solenoid, valve body, or software update. We rule those out before recommending a rebuild."
      },
      {
        "q": "How long does transmission repair take?",
        "a": "Services and minor repairs are same day. Rebuilds and replacements typically take several days depending on parts availability."
      }
    ],
    "internalLinks": [
      {
        "label": "Car Diagnostics Brampton",
        "to": "/car-diagnostics-brampton",
        "description": "Accurate scan diagnosis before transmission work."
      },
      {
        "label": "Auto Repair Brampton",
        "to": "/auto-repair-brampton",
        "description": "Full Sultan Motors repair overview."
      },
      {
        "label": "Car Maintenance Brampton",
        "to": "/car-maintenance-brampton",
        "description": "Transmission fluid service on schedule."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book a transmission inspection."
      }
    ]
  },
  {
    "slug": "suspension-repair-brampton",
    "eyebrow": "SUSPENSION REPAIR BRAMPTON",
    "h1": "SUSPENSION REPAIR BRAMPTON THAT RESTORES THE RIDE.",
    "heroSubtitle": "Sultan Motors handles shocks, struts, control arms, sway bars, ball joints, and steering components for Brampton drivers who want their vehicle to feel new again.",
    "heroImageAlt": "Suspension repair Brampton at Sultan Motors",
    "intro": {
      "eyebrow": "STRUT REPAIR BRAMPTON",
      "heading": "Comfort, control, and safety come from a healthy suspension.",
      "body": "Suspension is what keeps your tires on the road, your steering precise, and your ride comfortable. Sultan Motors inspects every component, replaces what is worn, and aligns the vehicle so your car handles the way the manufacturer intended.",
      "bullets": [
        "Shock and strut replacement",
        "Control arm, ball joint, and tie rod repair",
        "Sway bar links and bushings",
        "Steering rack and power steering repair"
      ]
    },
    "serviceCards": {
      "heading": "Suspension problems we repair.",
      "cards": [
        {
          "title": "Shocks and Struts",
          "description": "Worn shocks and struts replaced with quality OEM level components."
        },
        {
          "title": "Ball Joints and Tie Rods",
          "description": "Steering and suspension joints replaced to restore precise handling."
        },
        {
          "title": "Control Arms and Bushings",
          "description": "Cracked or worn control arms and bushings replaced to spec."
        },
        {
          "title": "Sway Bars",
          "description": "Sway bar links and bushings that stop clunks and improve cornering."
        },
        {
          "title": "Steering Components",
          "description": "Rack, pump, and hose repair for precise, quiet steering."
        },
        {
          "title": "Ride Quality",
          "description": "Complete ride quality diagnosis when your vehicle no longer feels right."
        }
      ]
    },
    "whyUs": {
      "heading": "Symptoms your suspension needs work.",
      "points": [
        {
          "title": "Bouncing after bumps",
          "description": "Excessive bounce means your shocks or struts are no longer damping properly."
        },
        {
          "title": "Uneven tire wear",
          "description": "Cupped or feathered tire wear points to worn suspension or bad alignment."
        },
        {
          "title": "Pulling or wandering",
          "description": "A car that will not track straight often has worn components or a bad alignment."
        }
      ]
    },
    "process": {
      "heading": "Our suspension process.",
      "steps": [
        {
          "title": "Road Test",
          "description": "We drive the vehicle to feel handling, tracking, and noise."
        },
        {
          "title": "Inspect",
          "description": "Full suspension inspection on a lift with pry bar and visual checks."
        },
        {
          "title": "Recommend",
          "description": "Priority ranked repairs with a clear written quote."
        },
        {
          "title": "Repair",
          "description": "Worn parts replaced with quality components torqued to spec."
        },
        {
          "title": "Align",
          "description": "Wheel alignment finishes the job so tires wear evenly."
        }
      ]
    },
    "gallery": {
      "heading": "Suspension work at Sultan Motors.",
      "images": [
        {
          "caption": "SUSPENSION"
        },
        {
          "caption": "PRECISION"
        },
        {
          "caption": "WORKSHOP"
        }
      ]
    },
    "faqs": [
      {
        "q": "How long do shocks and struts last?",
        "a": "Most shocks and struts last 80,000 to 160,000 kilometres depending on road conditions and driving style. Sultan Motors checks them at every visit."
      },
      {
        "q": "Should shocks be replaced in pairs?",
        "a": "Yes. Replacing both sides of an axle at once keeps handling balanced and predictable."
      },
      {
        "q": "Do I need an alignment after suspension work?",
        "a": "In most cases, yes. Replacing suspension parts changes geometry, and an alignment ensures even tire wear and straight tracking."
      }
    ],
    "internalLinks": [
      {
        "label": "Brake Repair Brampton",
        "to": "/brake-repair-brampton",
        "description": "Brakes and suspension work together for safe stopping."
      },
      {
        "label": "Auto Repair Brampton",
        "to": "/auto-repair-brampton",
        "description": "See the full Sultan Motors repair menu."
      },
      {
        "label": "Car Diagnostics Brampton",
        "to": "/car-diagnostics-brampton",
        "description": "Rule out electronic issues affecting ride quality."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book a Brampton suspension inspection."
      }
    ]
  },
  {
    "slug": "auto-electrical-repair-brampton",
    "eyebrow": "AUTO ELECTRICAL REPAIR BRAMPTON",
    "h1": "AUTO ELECTRICAL REPAIR BRAMPTON YOU CAN TRUST.",
    "heroSubtitle": "Sultan Motors handles batteries, alternators, starters, wiring faults, sensor failures, and full electrical diagnostics for every vehicle in Brampton.",
    "heroImageAlt": "Auto electrical repair Brampton at Sultan Motors",
    "intro": {
      "eyebrow": "CAR ELECTRICAL PROBLEMS BRAMPTON",
      "heading": "Electrical faults are our specialty, not a guessing game.",
      "body": "Modern vehicles run on dozens of computers, hundreds of sensors, and kilometres of wiring. Sultan Motors uses meters, oscilloscopes, and manufacturer wiring diagrams to trace faults to the wire, not just the module, so repairs are surgical instead of expensive.",
      "bullets": [
        "Battery testing and replacement",
        "Alternator, starter, and charging system service",
        "Sensor diagnosis and replacement",
        "Wiring, connector, and parasitic drain testing"
      ]
    },
    "serviceCards": {
      "heading": "Electrical problems we repair.",
      "cards": [
        {
          "title": "Battery Problems",
          "description": "Load testing, terminal service, and premium battery replacement."
        },
        {
          "title": "Alternator Issues",
          "description": "Charging system diagnosis and alternator replacement with quality parts."
        },
        {
          "title": "Starter Failures",
          "description": "Starter testing, replacement, and connection repair."
        },
        {
          "title": "Wiring Repair",
          "description": "Damaged harnesses, connectors, and grounds properly repaired."
        },
        {
          "title": "Sensor Failures",
          "description": "Oxygen, MAF, ABS, crank, and cam sensor testing and replacement."
        },
        {
          "title": "Parasitic Drains",
          "description": "Full parasitic draw testing to solve dead battery mysteries."
        }
      ]
    },
    "whyUs": {
      "heading": "Electrical diagnosis done properly.",
      "points": [
        {
          "title": "Wiring diagrams",
          "description": "We use factory wiring diagrams to test at the exact pin, not swap parts hoping to get lucky."
        },
        {
          "title": "Real testing equipment",
          "description": "Meters, scan tools, and scopes let us watch signals live and prove the fault."
        },
        {
          "title": "Root cause fixes",
          "description": "We fix the underlying cause of shorts and drains so the problem stays fixed."
        }
      ]
    },
    "process": {
      "heading": "Our electrical repair process.",
      "steps": [
        {
          "title": "Scan",
          "description": "Full vehicle module scan for stored and pending fault codes."
        },
        {
          "title": "Test",
          "description": "Voltage, resistance, and signal testing at the affected circuit."
        },
        {
          "title": "Verify",
          "description": "Confirm the exact failed component or wire before ordering parts."
        },
        {
          "title": "Repair",
          "description": "Proper repair with quality parts and correct wiring technique."
        },
        {
          "title": "Retest",
          "description": "Post repair testing to confirm the fault is truly gone."
        }
      ]
    },
    "gallery": {
      "heading": "Electrical work at Sultan Motors.",
      "images": [
        {
          "caption": "DIAGNOSTICS"
        },
        {
          "caption": "TESTING"
        },
        {
          "caption": "WORKSHOP"
        }
      ]
    },
    "faqs": [
      {
        "q": "Why does my battery keep dying?",
        "a": "Usually one of three causes: an aging battery, a failing alternator, or a parasitic drain from a stuck circuit. Sultan Motors tests all three so you replace the right thing once."
      },
      {
        "q": "Can you fix wiring damage from rodents?",
        "a": "Yes. Rodent damage is common in Brampton winters. We locate every damaged section and repair or replace the harness with proper connectors and heat shrink."
      },
      {
        "q": "How much does an alternator cost to replace?",
        "a": "It depends on the vehicle and part quality. Sultan Motors provides a written estimate after testing so you know the price up front."
      }
    ],
    "internalLinks": [
      {
        "label": "Car Diagnostics Brampton",
        "to": "/car-diagnostics-brampton",
        "description": "Fault code and drivability testing."
      },
      {
        "label": "Auto Repair Brampton",
        "to": "/auto-repair-brampton",
        "description": "Full Sultan Motors service menu."
      },
      {
        "label": "Engine Repair Brampton",
        "to": "/engine-repair-brampton",
        "description": "For confirmed engine mechanical issues."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book an electrical inspection."
      }
    ]
  },
  {
    "slug": "collision-repair-brampton",
    "eyebrow": "COLLISION REPAIR BRAMPTON",
    "h1": "COLLISION REPAIR BRAMPTON THAT LOOKS FACTORY NEW.",
    "heroSubtitle": "Sultan Motors handles accident repair, structural work, frame straightening, panel replacement, and full paint refinishing with insurance friendly estimates.",
    "heroImageAlt": "Collision repair Brampton at Sultan Motors",
    "intro": {
      "eyebrow": "ACCIDENT REPAIR BRAMPTON",
      "heading": "From tow in to keys back, we handle every step.",
      "body": "A collision is stressful enough. Sultan Motors manages the entire process for Brampton drivers, from insurance documentation through structural repair to final colour match, so your vehicle returns looking and driving the way it did before the accident.",
      "bullets": [
        "Insurance claim assistance and direct billing",
        "Frame and structural repair",
        "Panel and body replacement",
        "Colour matched paint refinishing"
      ]
    },
    "serviceCards": {
      "heading": "Collision services we provide.",
      "cards": [
        {
          "title": "Accident Repair",
          "description": "Front end, rear end, and side impact repair to pre accident condition."
        },
        {
          "title": "Structural Repair",
          "description": "Unibody and frame straightening with measuring equipment and certified welding."
        },
        {
          "title": "Frame Repair",
          "description": "Frame pulls, sectioning, and replacement done to manufacturer specification."
        },
        {
          "title": "Panel Replacement",
          "description": "Doors, fenders, hoods, and quarter panels replaced with OEM level parts."
        },
        {
          "title": "Paint Refinishing",
          "description": "Colour matched refinishing that blends seamlessly with your original paint."
        },
        {
          "title": "Insurance Assistance",
          "description": "We work directly with your insurance company to keep the process simple."
        }
      ]
    },
    "whyUs": {
      "heading": "Why Sultan Motors for collision repair.",
      "points": [
        {
          "title": "Structural expertise",
          "description": "Certified technicians and proper equipment for safe, spec correct structural repair."
        },
        {
          "title": "Insurance friendly",
          "description": "Direct communication and documentation that speeds up your claim."
        },
        {
          "title": "Colour match guarantee",
          "description": "Our paint department blends colour so repairs are invisible after refinishing."
        }
      ]
    },
    "process": {
      "heading": "Our collision repair process.",
      "steps": [
        {
          "title": "Estimate",
          "description": "Detailed damage assessment with photos and a written estimate for your insurer."
        },
        {
          "title": "Repair",
          "description": "Structural work, panel replacement, and body repair done to spec."
        },
        {
          "title": "Paint",
          "description": "Colour matched refinishing in a controlled paint booth environment."
        },
        {
          "title": "Quality Check",
          "description": "Alignment, gap, and finish inspected before delivery."
        },
        {
          "title": "Delivery",
          "description": "Final detail and walk around so you leave confident in the repair."
        }
      ]
    },
    "gallery": {
      "heading": "Collision repair gallery.",
      "subheading": "Before and after work performed by the Sultan Motors body shop team in Brampton.",
      "images": [
        {
          "caption": "STRUCTURAL"
        },
        {
          "caption": "PAINT BOOTH"
        },
        {
          "caption": "FINAL DETAIL"
        }
      ]
    },
    "faqs": [
      {
        "q": "Do you work with insurance companies?",
        "a": "Yes. Sultan Motors works with every major Ontario insurer and can handle communication, documentation, and direct billing so you focus on getting back on the road."
      },
      {
        "q": "How long does collision repair take?",
        "a": "Small cosmetic repairs finish in a few days. Structural repairs and full paint work can take one to three weeks depending on parts availability."
      },
      {
        "q": "Will my repair look factory new?",
        "a": "That is the standard we work to. Panels are replaced to spec, paint is colour matched, and every finished repair goes through a quality check before delivery."
      }
    ],
    "internalLinks": [
      {
        "label": "Auto Body Repair Brampton",
        "to": "/auto-body-repair-brampton",
        "description": "Dent, panel, and body work outside of collisions."
      },
      {
        "label": "Car Painting Brampton",
        "to": "/car-painting-brampton",
        "description": "Colour matched refinishing and full repaints."
      },
      {
        "label": "Safety Standards Certificate Brampton",
        "to": "/safety-standards-certificate-brampton",
        "description": "Ontario safety inspections for vehicle transfers and registration."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book a collision estimate."
      }
    ]
  },
  {
    "slug": "auto-body-repair-brampton",
    "eyebrow": "AUTO BODY REPAIR BRAMPTON",
    "h1": "AUTO BODY REPAIR BRAMPTON WITH A SHOWROOM FINISH.",
    "heroSubtitle": "Sultan Motors delivers dent repair, panel work, paint correction, and full body restoration for Brampton drivers who want their vehicle looking its best.",
    "heroImageAlt": "Auto body repair Brampton at Sultan Motors",
    "intro": {
      "eyebrow": "BODY SHOP BRAMPTON",
      "heading": "Body repair that respects the vehicle you own.",
      "body": "Every panel we touch is prepared, repaired, and refinished with the same standard whether the job is a small parking lot dent or a full quarter panel. Sultan Motors combines traditional hand skills with modern paint technology so your car leaves looking straight, smooth, and correctly coloured.",
      "bullets": [
        "Dent repair and paintless dent removal where possible",
        "Panel repair and replacement",
        "Paint correction, polishing, and refinishing",
        "Full body restoration for older or high mileage vehicles"
      ]
    },
    "serviceCards": {
      "heading": "Auto body services in Brampton.",
      "cards": [
        {
          "title": "Dent Repair",
          "description": "Door dings, hail damage, and parking lot dents repaired to a smooth finish."
        },
        {
          "title": "Panel Repair",
          "description": "Bent and creased panels straightened or replaced with OEM level parts."
        },
        {
          "title": "Paint Correction",
          "description": "Swirl removal, oxidation correction, and clear coat polishing."
        },
        {
          "title": "Body Restoration",
          "description": "Full body restoration for older vehicles or those returning to showroom condition."
        },
        {
          "title": "Rust Repair",
          "description": "Rust removal and metal repair before it spreads into structural areas."
        },
        {
          "title": "Bumper Repair",
          "description": "Cracked, scuffed, and scratched bumpers repaired and refinished."
        }
      ]
    },
    "whyUs": {
      "heading": "Why Brampton drivers trust our body shop.",
      "points": [
        {
          "title": "Craftsmanship first",
          "description": "Experienced technicians who prep, block, and paint the way it should be done."
        },
        {
          "title": "Colour match",
          "description": "Computer colour matching with hand tinting to blend every repair invisibly."
        },
        {
          "title": "Long term finish",
          "description": "Quality paint, primer, and clear coat that hold up to Ontario weather."
        }
      ]
    },
    "process": {
      "heading": "Our body repair process.",
      "steps": [
        {
          "title": "Inspect",
          "description": "Damage assessment and written estimate for the exact work required."
        },
        {
          "title": "Prep",
          "description": "Panel prep, sanding, and metal work to a straight surface."
        },
        {
          "title": "Prime",
          "description": "Primer and block sanding for a flawless base under the colour."
        },
        {
          "title": "Paint",
          "description": "Colour matched base coat and clear coat sprayed in a controlled booth."
        },
        {
          "title": "Polish",
          "description": "Final polish, alignment, and detail before delivery."
        }
      ]
    },
    "gallery": {
      "heading": "Auto body work gallery.",
      "subheading": "Real repairs and refinishes from the Sultan Motors body shop in Brampton.",
      "images": [
        {
          "caption": "PANEL WORK"
        },
        {
          "caption": "PAINT"
        },
        {
          "caption": "FINAL FINISH"
        }
      ]
    },
    "faqs": [
      {
        "q": "How long does auto body repair take?",
        "a": "Minor dent and paint work is usually completed in a few days. Larger panel and refinishing jobs take one to two weeks depending on parts and paint drying."
      },
      {
        "q": "Do you match paint colour exactly?",
        "a": "Yes. We use computer colour matching plus hand tinting to blend the repair into the surrounding panels so the fix is invisible."
      },
      {
        "q": "Can you fix rust before it spreads?",
        "a": "Absolutely. Catching rust early is the best way to save a panel. Sultan Motors removes affected metal, treats the area, and refinishes so the problem does not return."
      }
    ],
    "internalLinks": [
      {
        "label": "Collision Repair Brampton",
        "to": "/collision-repair-brampton",
        "description": "Full accident and structural repair."
      },
      {
        "label": "Car Painting Brampton",
        "to": "/car-painting-brampton",
        "description": "Refinishing and full repaints."
      },
      {
        "label": "Safety Standards Certificate Brampton",
        "to": "/safety-standards-certificate-brampton",
        "description": "Ontario safety inspections for vehicle transfers and registration."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book a body shop estimate."
      }
    ]
  },
  {
    "slug": "car-painting-brampton",
    "eyebrow": "CAR PAINTING BRAMPTON",
    "h1": "CAR PAINTING BRAMPTON WITH A DEEP FACTORY FINISH.",
    "heroSubtitle": "Sultan Motors delivers colour matched refinishing, scratch repair, full repaints, and clear coat restoration in a controlled paint booth environment in Brampton.",
    "heroImageAlt": "Car painting Brampton at Sultan Motors",
    "intro": {
      "eyebrow": "AUTO PAINT SHOP BRAMPTON",
      "heading": "Paint work that looks right from every angle.",
      "body": "Great paint work starts with great prep. Sultan Motors sands, primes, and blocks every panel before colour touches it, then applies base coat and clear coat in a filtered downdraft booth. The result is a deep, uniform finish that matches your original paint or transforms the vehicle completely.",
      "bullets": [
        "Computer and hand tinted colour matching",
        "Scratch and chip repair",
        "Full vehicle repaints",
        "Clear coat restoration and refinishing"
      ]
    },
    "serviceCards": {
      "heading": "Painting services in Brampton.",
      "cards": [
        {
          "title": "Paint Matching",
          "description": "Precise colour matching for seamless spot repairs and panel refinishing."
        },
        {
          "title": "Scratch Repair",
          "description": "Deep scratches sanded, filled, and refinished so they disappear."
        },
        {
          "title": "Full Repaint",
          "description": "Complete colour changes or refresh paints for high mileage vehicles."
        },
        {
          "title": "Clear Coat",
          "description": "Failing clear coat stripped, corrected, and re sprayed for a lasting shine."
        },
        {
          "title": "Refinishing",
          "description": "Panel refinishing after collision or body repair for factory level results."
        },
        {
          "title": "Detailing Prep",
          "description": "Machine polish and correction after paint work for a showroom finish."
        }
      ]
    },
    "whyUs": {
      "heading": "The Sultan Motors paint difference.",
      "points": [
        {
          "title": "Downdraft booth",
          "description": "A filtered downdraft booth keeps dust out of the paint for a clean, glass smooth finish."
        },
        {
          "title": "Long lasting materials",
          "description": "Quality base coat and clear coat that hold up to Ontario sun, salt, and winters."
        },
        {
          "title": "True colour match",
          "description": "Camera matching combined with hand tinting so blends are invisible."
        }
      ]
    },
    "process": {
      "heading": "Our refinishing process.",
      "steps": [
        {
          "title": "Prep",
          "description": "Panel cleaning, sanding, and dent or damage repair before any paint work."
        },
        {
          "title": "Prime",
          "description": "Primer application and block sanding to a perfectly flat surface."
        },
        {
          "title": "Match",
          "description": "Colour matched and tinted to your original paint before spraying."
        },
        {
          "title": "Spray",
          "description": "Base coat and clear coat applied in a downdraft booth."
        },
        {
          "title": "Polish",
          "description": "Wet sand and polish for a glass smooth showroom finish."
        }
      ]
    },
    "gallery": {
      "heading": "Paint work at Sultan Motors.",
      "images": [
        {
          "caption": "PAINT BOOTH"
        },
        {
          "caption": "PREP"
        },
        {
          "caption": "FINISH"
        }
      ]
    },
    "faqs": [
      {
        "q": "How long does a car repaint take?",
        "a": "A partial refinish is usually completed in three to five days. A full repaint typically takes one to two weeks depending on prep, paint drying, and polish time."
      },
      {
        "q": "Can you match my exact paint colour?",
        "a": "Yes. We use camera colour matching plus hand tinting so blends into your existing panels are invisible in every light."
      },
      {
        "q": "How do I maintain a fresh paint job?",
        "a": "Hand wash for the first month, avoid automated brush washes for the first 30 days, and keep the vehicle out of harsh sun where possible while the paint cures."
      }
    ],
    "internalLinks": [
      {
        "label": "Auto Body Repair Brampton",
        "to": "/auto-body-repair-brampton",
        "description": "Body work that pairs with paint refinishing."
      },
      {
        "label": "Collision Repair Brampton",
        "to": "/collision-repair-brampton",
        "description": "Full accident and structural repair."
      },
      {
        "label": "Safety Standards Certificate Brampton",
        "to": "/safety-standards-certificate-brampton",
        "description": "Ontario safety inspections for vehicle transfers and registration."
      },
      {
        "label": "Contact Sultan Motors",
        "to": "/contact",
        "description": "Book a paint estimate."
      }
    ]
  },
  {
      "slug": "safety-standards-certificate-brampton",
      "eyebrow": "SAFETY STANDARDS CERTIFICATE BRAMPTON",
      "h1": "SAFETY STANDARDS CERTIFICATE BRAMPTON FOR A SMOOTH VEHICLE TRANSFER.",
      "heroSubtitle": "Sultan Motors helps Brampton drivers get their vehicle inspected for an Ontario Safety Standards Certificate when buying, selling, transferring, importing, or registering a vehicle that requires a safety inspection.",
      "heroImageAlt": "Vehicle raised on a two-post hoist for a safety inspection at Sultan Motors in Brampton",
      "heroCta": "Book Your Safety Inspection",
      "intro": {
        "eyebrow": "ONTARIO SAFETY CERTIFICATE BRAMPTON",
        "heading": "Get your vehicle ready for its Ontario safety inspection.",
        "body": [
          "A Safety Standards Certificate, commonly called a safety certificate or Ontario safety, confirms that a vehicle met Ontario's minimum safety standards at the time it was inspected. Sultan Motors can inspect your vehicle, identify safety related issues, explain what needs attention, and help you get the necessary repairs completed before a qualifying vehicle passes its inspection.",
          "Ontario requires a Safety Standards Certificate for several situations, including transferring a used vehicle to a new owner in many cases, registering a vehicle brought into Ontario from another province or country, registering a rebuilt vehicle, and changing a vehicle's status from unfit to fit. The certificate is only valid for 36 calendar days after the inspection."
        ],
        "bullets": [
          "Ontario Safety Standards Certificate inspections",
          "Used vehicle safety inspections for ownership transfers",
          "Out of province vehicle safety inspections",
          "Unfit to fit vehicle inspections",
          "Safety related repairs and inspection preparation",
          "Clear explanation of inspection results and required repairs"
        ]
      },
      "serviceCards": {
        "heading": "COMPLETE SAFETY INSPECTION SUPPORT IN BRAMPTON.",
        "subheading": "Getting a vehicle safety approved is about more than simply checking a few items. Ontario's inspection standard covers the vehicle's safety related components and requires the vehicle to meet the applicable minimum standards at the time of inspection.",
        "cards": [
          {
            "title": "Safety Standards Inspection",
            "description": "A detailed inspection of the vehicle's safety related systems against the applicable Ontario inspection requirements."
          },
          {
            "title": "Brake Inspection",
            "description": "Brake components are checked for condition and operation, including components that can affect your vehicle's ability to stop safely."
          },
          {
            "title": "Steering and Suspension",
            "description": "Steering and suspension components are inspected for wear, looseness, damage, and other conditions that can affect safe vehicle control."
          },
          {
            "title": "Tires and Wheels",
            "description": "Tires, wheels, and related components are checked for conditions that may prevent the vehicle from meeting the applicable safety standard."
          },
          {
            "title": "Lighting and Electrical Safety",
            "description": "Required lighting and safety related electrical components are inspected for proper operation and condition."
          },
          {
            "title": "Safety Repair Preparation",
            "description": "If your vehicle does not meet the applicable standard, our technicians can identify the required repairs and help get the vehicle ready for reinspection."
          }
        ]
      },
      "whyUs": {
        "heading": "WHY BRAMPTON DRIVERS CHOOSE SULTAN MOTORS FOR SAFETY INSPECTIONS.",
        "points": [
          {
            "title": "Experienced technicians",
            "description": "Our team has more than 20 years of automotive experience diagnosing mechanical problems and keeping vehicles safe on Brampton roads."
          },
          {
            "title": "Safety first approach",
            "description": "We focus on the condition of the vehicle's safety systems rather than simply looking for a quick pass."
          },
          {
            "title": "Clear repair recommendations",
            "description": "If your vehicle needs repairs, we explain what is wrong, why it matters, and what needs to be addressed."
          },
          {
            "title": "One shop for inspection and repairs",
            "description": "From brakes and suspension to steering, tires, lighting, and other mechanical issues, Sultan Motors can handle the repairs your vehicle may need."
          },
          {
            "title": "Straightforward service",
            "description": "You get clear communication throughout the inspection and repair process with no unnecessary pressure or confusing recommendations."
          }
        ]
      },
      "whenYouNeed": {
        "eyebrow": "WHEN YOU NEED IT",
        "heading": "WHEN DO YOU NEED A SAFETY STANDARDS CERTIFICATE IN ONTARIO?",
        "body": "A Safety Standards Certificate is commonly required when transferring a used vehicle to a new owner, registering a vehicle in Ontario that was previously registered outside Ontario, registering a rebuilt vehicle, or changing a vehicle's status from unfit to fit. Certain exemptions and vehicle specific requirements apply.",
        "items": [
          {
            "title": "Buying or Selling a Used Vehicle",
            "description": "A Safety Standards Certificate may be required when a used vehicle is transferred to a new owner. If you are selling a used vehicle in Ontario, the seller must provide the required safety certificate when applicable."
          },
          {
            "title": "Registering an Out of Province Vehicle",
            "description": "Bringing a vehicle into Ontario from another province, territory, or country can require a safety standards inspection before registration."
          },
          {
            "title": "Changing an Unfit Vehicle to Fit",
            "description": "If your vehicle is currently registered as unfit and you want to change its status to fit, a qualifying safety inspection is required."
          },
          {
            "title": "Registering a Rebuilt Vehicle",
            "description": "Rebuilt vehicles have additional inspection requirements. Salvage vehicles can require both a Structural Inspection Certificate and a Safety Standards Certificate."
          }
        ]
      },
      "process": {
        "heading": "OUR FIVE STEP SAFETY INSPECTION PROCESS.",
        "steps": [
          {
            "title": "INSPECT",
            "description": "We examine the vehicle's applicable safety systems using the Ontario inspection requirements."
          },
          {
            "title": "IDENTIFY",
            "description": "Any safety related concerns are identified and explained clearly so you understand what your vehicle needs."
          },
          {
            "title": "REPAIR",
            "description": "If repairs are required, our technicians can address qualifying mechanical and safety issues using quality replacement parts and proper repair procedures."
          },
          {
            "title": "REINSPECT",
            "description": "After required repairs are completed, the vehicle can be assessed again as applicable to determine whether it meets the required standard."
          },
          {
            "title": "CERTIFY",
            "description": "When the vehicle passes the applicable inspection at a licensed DriveON Vehicle Inspection Centre, the Safety Standards Certificate is issued electronically."
          }
        ]
      },
      "inspectChecklist": {
        "eyebrow": "WHAT WE INSPECT",
        "heading": "SAFETY RELATED VEHICLE SYSTEMS WE CHECK.",
        "body": "A proper Ontario safety inspection is designed to determine whether a vehicle meets the minimum safety requirements at the time of inspection. It is not a general vehicle condition report or a guarantee of future reliability.",
        "items": [
          {
            "title": "BRAKES",
            "description": "Brake condition and operation."
          },
          {
            "title": "STEERING",
            "description": "Steering components and safe vehicle control."
          },
          {
            "title": "SUSPENSION",
            "description": "Suspension components and related safety concerns."
          },
          {
            "title": "TIRES",
            "description": "Tire condition and wheel related safety items."
          },
          {
            "title": "LIGHTING",
            "description": "Required lamps and lighting functions."
          },
          {
            "title": "GLAZING",
            "description": "Applicable glass and visibility requirements."
          },
          {
            "title": "BODY AND STRUCTURE",
            "description": "Safety related body and structural conditions."
          },
          {
            "title": "OTHER SAFETY SYSTEMS",
            "description": "Additional components covered by the applicable Ontario inspection standard."
          }
        ]
      },
      "readyBlock": {
        "eyebrow": "SAFETY CERTIFICATE BRAMPTON",
        "heading": "GET YOUR VEHICLE READY BEFORE YOU GO TO SERVICEONTARIO.",
        "paragraphs": [
          "If you are preparing to transfer ownership or register a vehicle, getting the required safety inspection completed is an important part of the process. A Safety Standards Certificate confirms that the vehicle met Ontario's minimum safety standards on the date it was issued.",
          "Once the vehicle passes, the certificate is provided electronically and can be used for the applicable registration process. Ontario states that a Safety Standards Certificate is valid for 36 calendar days after the inspection.",
          "Sultan Motors can help you understand what your vehicle needs before you complete the registration process, so you are not left guessing about brakes, suspension, tires, steering, lights, or other safety related repairs."
        ]
      },
      "faqHeading": "QUESTIONS BRAMPTON DRIVERS ASK ABOUT SAFETY CERTIFICATES.",
      "cta": {
        "eyebrow": "BOOK YOUR SAFETY INSPECTION",
        "heading": "READY TO GET YOUR VEHICLE SAFETY APPROVED?",
        "body": "Speak with Sultan Motors about your Ontario Safety Standards Certificate inspection, required safety repairs, or vehicle registration needs at 5 Melanie Dr Unit 2 in Brampton."
      },
      "faqs": [
        {
          "q": "What is a Safety Standards Certificate in Ontario?",
          "a": "A Safety Standards Certificate is an official certificate confirming that a vehicle met Ontario's applicable minimum safety standards at the time it was inspected. It is commonly required for certain vehicle ownership transfers and registration situations. It is not a warranty or guarantee of the vehicle's overall condition."
        },
        {
          "q": "Do I need a safety certificate to sell my car in Ontario?",
          "a": "A Safety Standards Certificate is required for many used vehicle ownership transfers when the vehicle is being transferred as fit. There are specific exemptions, so your exact situation should be confirmed based on the vehicle and type of transfer."
        },
        {
          "q": "How long is an Ontario Safety Standards Certificate valid?",
          "a": "A Safety Standards Certificate is valid for 36 calendar days after the inspection. If it expires before the vehicle is registered, a new inspection and certificate may be required."
        },
        {
          "q": "Can I register my vehicle without a Safety Standards Certificate?",
          "a": "You can buy and register a vehicle without a Safety Standards Certificate in some circumstances, but you cannot put a licence plate on a vehicle without the required certificate when one is applicable."
        },
        {
          "q": "What happens if my vehicle fails the safety inspection?",
          "a": "If a vehicle does not meet the applicable safety requirements, the necessary issues must be addressed before it can pass. Sultan Motors can explain the repair requirements and provide mechanical repair services for safety related problems."
        },
        {
          "q": "Do you inspect out of province vehicles?",
          "a": "Vehicles brought into Ontario from another province, territory, or country can require a Safety Standards Certificate before registration. The exact requirements depend on the vehicle and registration situation."
        },
        {
          "q": "Is a safety certificate the same as a vehicle inspection?",
          "a": "A Safety Standards Certificate is issued after a qualifying vehicle passes the applicable Ontario safety inspection. The inspection is specifically focused on minimum safety standards and does not guarantee the vehicle's overall mechanical condition or future reliability."
        },
        {
          "q": "How much does a Safety Standards Certificate cost in Ontario?",
          "a": "The cost of a safety inspection and certificate varies by inspection centre and is not set by the Ontario government. Sultan Motors can provide information about the inspection and any repairs your vehicle may require."
        }
      ],
      "internalLinks": [
        {
          "label": "Auto Repair Brampton",
          "to": "/auto-repair-brampton",
          "description": "Complete automotive repair and maintenance for Brampton drivers."
        },
        {
          "label": "Car Diagnostics Brampton",
          "to": "/car-diagnostics-brampton",
          "description": "Find mechanical and electronic problems before they become bigger repairs."
        },
        {
          "label": "Brake Repair Brampton",
          "to": "/brake-repair-brampton",
          "description": "Brake inspection and repair for safer stopping."
        },
        {
          "label": "Suspension Repair Brampton",
          "to": "/suspension-repair-brampton",
          "description": "Steering and suspension repairs for safer handling."
        },
        {
          "label": "Car Maintenance Brampton",
          "to": "/car-maintenance-brampton",
          "description": "Keep your vehicle reliable with scheduled maintenance and inspections."
        }
      ]
    }
]
