# Pathways Integration Guide

Integration of the **E² Teaching Framework** tools with the **Pathways Navigator** platform (pathways-edu.netlify.app).

## Overview

This integration enables Pathways to launch E² tools with:
- **Subject context** — pre-filled teaching suggestions for the selected subject
- **Premium tier gating** — free / premium / school tier feature access
- **Dynamic suggestions** — learning objectives, materials, assessments, engagement strategies tailored to each subject

## URL Structure

All E² tools now accept two URL parameters:

```
?subject=<SUBJECT_KEY>&tier=<TIER_KEY>
```

### Supported Subjects

| Key | Subject Name | Color |
|-----|--------------|-------|
| `math` | Mathematics | #4A90E2 |
| `science` | Science | #7ED321 |
| `english` | English Language Arts | #F5A623 |
| `history` | History & Social Studies | #BD10E0 |
| `stem` | STEM & Engineering | #2196F3 |
| `languages` | World Languages | #FF6B6B |
| `arabic` | Arabic & Islamic Studies | #009688 |

### Supported Tiers

| Key | Tier Name | Description |
|-----|-----------|-------------|
| `free` | Free Tier | Basic tools, localStorage only |
| `premium` | Premium (Individual) | PDF export, cloud sync, custom templates, AI suggestions |
| `school` | School License | All premium + LMS integration, analytics, custom branding, 24/7 support |

## Integration URLs

### 1. Smart Launcher (Recommended Entry Point)

```
https://dinaelahl.github.io/desktop-tutorial/pathways-launcher.html?subject=math&tier=premium
```

Displays subject selector, tool cards, and tier features panel.

### 2. Direct Tool Launch

**Lesson Planner:**
```
https://dinaelahl.github.io/desktop-tutorial/e2-lesson-planner.html?subject=science&tier=free
```

**Blueprint Planner:**
```
https://dinaelahl.github.io/desktop-tutorial/e2-blueprint-planner.html?subject=english&tier=premium
```

**Rubrics & Assessment:**
```
https://dinaelahl.github.io/desktop-tutorial/e2-rubrics-assessment.html?subject=history&tier=school
```

## How to Link from Pathways

### In Pathways apps.html

Replace existing E² tool links with parameterized URLs:

```html
<!-- Before -->
<a href="https://dinaelahl.github.io/desktop-tutorial/e2-lesson-planner.html">
  E² Lesson Planner
</a>

<!-- After -->
<a href="https://dinaelahl.github.io/desktop-tutorial/pathways-launcher.html?subject=${currentSubject}&tier=${userTier}">
  E² Lesson Planner
</a>
```

### JavaScript Helper

```javascript
function launchE2Tool(tool, subject, tier) {
  const baseUrl = 'https://dinaelahl.github.io/desktop-tutorial/';
  const toolFiles = {
    'lesson': 'e2-lesson-planner.html',
    'blueprint': 'e2-blueprint-planner.html',
    'rubrics': 'e2-rubrics-assessment.html',
    'launcher': 'pathways-launcher.html'
  };
  const file = toolFiles[tool] || toolFiles.launcher;
  const params = new URLSearchParams({ subject, tier });
  window.open(`${baseUrl}${file}?${params}`, '_blank');
}

// Usage
launchE2Tool('lesson', 'math', 'premium');
launchE2Tool('blueprint', 'science', 'school');
launchE2Tool('rubrics', 'english', 'free');
```

## What Happens When a Tool is Loaded

When any E² tool is opened with subject and tier parameters:

1. **Subject Banner** appears at the top showing:
   - Subject name with custom color
   - Current tier badge (FREE/PREMIUM/SCHOOL)
   - Contextual subtitle

2. **Suggestions Panel** (collapsible) displays:
   - Learning objectives for the subject
   - Recommended materials and resources
   - Assessment types
   - Engagement strategies
   - Differentiation tips

3. **Tier-Based Features**:
   - Free: Limited to 3 saved lessons, text export only
   - Premium: Unlimited saves, PDF/Word/HTML export, cloud sync, AI suggestions
   - School: All premium + LMS integration, analytics, custom branding

4. **Upgrade Prompts** appear when users try to access premium features on free tier.

## Files Added for Integration

| File | Purpose |
|------|---------|
| `subject-data.js` | Subject-specific suggestions and premium tier definitions |
| `premium-tier-logic.js` | Feature gating, tier detection, upgrade prompts |
| `pathways-launcher.html` | Integration gateway with subject selector and tier display |

## Files Modified

| File | Changes |
|------|---------|
| `e2-lesson-planner.html` | Added subject banner and suggestions panel |
| `e2-blueprint-planner.html` | Added subject banner and unit planning suggestions |
| `e2-rubrics-assessment.html` | Added subject banner and assessment-specific suggestions |
| `service-worker.js` | Bumped to v1.2.0, caches new integration files |

## Pricing Strategy (Suggested)

### Individual Teacher (Premium)
- $5/month or $48/year
- Unlimited saved lessons, rubrics, blueprints
- Cloud sync across devices
- PDF/Word/HTML export
- AI-powered teaching suggestions
- Priority email support

### School License (School Tier)
- $299/year per school (up to 50 teachers)
- $599/year per school (up to 150 teachers)
- $1,299/year per school (unlimited teachers)
- All premium features for all teachers
- LMS integration (Canvas, Google Classroom, Schoology)
- Analytics dashboard
- Custom branding (logo, colors)
- 24/7 phone & email support
- Annual training and onboarding

## Testing Checklist

- [ ] Launcher loads without parameters (shows selector)
- [ ] Launcher loads with `?subject=math` (auto-selects Math)
- [ ] Launcher loads with `?subject=math&tier=premium` (shows premium features)
- [ ] Each subject (math, science, english, history, stem, languages, arabic) displays correctly
- [ ] Each tier (free, premium, school) shows correct feature list
- [ ] Lesson planner loads with subject banner when `?subject=X` is passed
- [ ] Blueprint planner loads with subject banner when `?subject=X` is passed
- [ ] Rubrics assessment loads with subject banner when `?subject=X` is passed
- [ ] Tool cards in launcher have correct links with parameters
- [ ] Service worker caches new files for offline use

## Support

For questions or issues with the integration:
- GitHub Issues: https://github.com/DinaElAhl/desktop-tutorial/issues
- Email: support@e2teaching.com (example)

## License

© 2026 Dina El Ahl. See EULA.md for license terms.

**Every student has the right to understand.**
