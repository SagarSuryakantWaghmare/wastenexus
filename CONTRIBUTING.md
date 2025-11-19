# Contributing to WasteNexus

Thank you for your interest in contributing to **WasteNexus**!  
These guidelines will help you understand how to contribute effectively and maintain quality across the project.

---

## 📋 Before You Begin

Please make sure you:

- Read the **README.md**  
- Read the **CODE_OF_CONDUCT.md**  
- Check existing **issues** and **pull requests**  
- Search to ensure your idea or fix hasn’t been addressed already  

---

## 🐞 Submitting an Issue

When opening an issue, include:

1. Clear and descriptive title  
2. Exact steps to reproduce the problem  
3. Expected vs actual behavior  
4. Screenshots or logs (if applicable)  
5. Your environment: browser, OS, device, version  

Issues should focus on one problem at a time.

---

## 🔧 Submitting a Pull Request

To submit a high-quality pull request:

### 1. Fork the repository
```bash
https://github.com/SagarSuryakantWaghmare/wastenexus
````

### 2. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make your changes

Make sure your contribution:

* Follows the coding style
* Passes all linting rules (`npm run lint`)
* Does not break existing functionality
* Includes comments where needed
* Includes UI screenshots (for UI changes)

### 4. Commit using Conventional Commits

Examples:

```
feat: add new waste report filter
fix: resolve event join button issue
docs: update installation guide
```

### 5. Push your branch

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

Your PR should include:

* A clear description of what you changed
* A reference to related issues (e.g., “Closes #14”)
* Screenshots or videos for UI work
* Why this change is needed

Maintainers will review your PR and may request revisions before merging.

---

## 🧱 Project Structure Overview

```
app/                -> Next.js App Router pages
components/         -> UI components
contexts/           -> Global providers
hooks/              -> Custom React hooks
lib/                -> Utilities (AI, auth, cloud)
models/             -> MongoDB schemas
public/             -> Static assets & PWA icons
scripts/            -> Dev and migration scripts
```

---

## 🧩 Ways You Can Contribute

* Fix bugs
* Improve UI/UX
* Write documentation
* Add tests
* Refactor components
* Enhance performance
* Improve AI waste classification
* Contribute to PWA features
* Help with translations

---

## 📐 Coding Standards

* Use **TypeScript** strictly
* Follow existing code patterns
* Use **React functional components**
* Use **Tailwind CSS**, avoid inline styles
* Keep components reusable & modular
* Validate data using **Zod**
* Follow Next.js App Router conventions

---

## 🤝 Community Expectations

* Be respectful and constructive
* Be patient during code review
* Provide clear explanations
* Follow the Code of Conduct

---

## 📞 Need Help?

Open an issue here:
👉 [https://github.com/SagarSuryakantWaghmare/wastenexus/issues](https://github.com/SagarSuryakantWaghmare/wastenexus/issues)

Thank you for helping make **WasteNexus** better for everyone! 💚

