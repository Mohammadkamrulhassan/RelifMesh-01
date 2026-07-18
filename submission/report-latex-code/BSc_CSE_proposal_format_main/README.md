# BSc Thesis Proposal Template — RMSTU

**Department of Computer Science and Engineering**  
**Rangamati Science and Technology University**  
**Course: CSE-4101 (Thesis/Research — 1 Credit Hour)**  
**4th Year, 1st Semester**

---

## 📁 Project Structure

```
├── main.tex                    ← Entry point (compile this)
├── config/
│   ├── packages.tex            ← All package imports
│   ├── styles.tex              ← Layout, headers, footers, formatting
│   ├── info.tex                ← ✏️ YOUR DETAILS GO HERE
│   └── commands.tex            ← Reusable custom commands
├── pages/
│   ├── coverpage.tex           ← Cover page
│   ├── approval.tex            ← Approval page
│   ├── declaration.tex         ← Declaration page
│   ├── acknowledgement.tex     ← Acknowledgement
│   └── acronyms.tex            ← List of Acronyms
├── sections/
│   ├── 00_proposal_summary.tex ← Proposal Summary
│   ├── 01_introduction.tex     ← Introduction
│   ├── 02_problem_statement.tex← Problem Statement
│   ├── 03_research_questions.tex← Research Questions
│   ├── 04_research_objectives.tex← Research Objectives
│   ├── 05_rationale.tex        ← Rationale of the Study
│   ├── 06_literature_review.tex← Literature Review
│   ├── 07_research_gap.tex     ← Research Gap
│   ├── 08_methodology.tex      ← Proposed Methodology
│   ├── 09_expected_outcomes.tex← Expected Outcomes
│   ├── 10_work_plan.tex        ← Work Plan & Timeline
│   ├── 11_budget.tex           ← Budget (Optional)
│   ├── references.tex          ← References
│   └── appendices.tex          ← Appendices
├── figures/                    ← Place images here
│   └── (add rmstu_logo.png here)
└── README.md                   ← This file
```

## 🚀 Quick Start (Overleaf)

1. **Upload** this entire folder as a new project on [Overleaf](https://www.overleaf.com)
2. **Edit** `config/info.tex` — fill in your name, ID, supervisor, title, etc.
3. **Write** your content in each file inside `sections/`
4. **Compile** — Overleaf compiles automatically. Just click the green button!

## 🚀 Quick Start (Local)

```bash
pdflatex main.tex
pdflatex main.tex   # Run twice for TOC and references
```

## ✏️ How to Use

### Step 1: Fill in Your Details
Open `config/info.tex` and replace all placeholder values:
```latex
\newcommand{\thesistitle}{Your Actual Title Here}
\newcommand{\studentname}{Your Full Name}
\newcommand{\studentid}{161-35-XXXX}
...
```

### Step 2: Write Your Content
Each section is in a separate file — edit them one by one. Look for:
- **Gray placeholder text** — replace with your own writing
- **`% ===== WRITE YOUR ... HERE =====`** comments — your content goes below these

### Step 3: Add Your Logo
Place your university logo as `figures/rmstu_logo.png`. The cover page will automatically use it.

### Step 4: Add Figures
Place all images in the `figures/` directory and reference them:
```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.8\textwidth]{figures/your_image.png}
    \caption{Your caption here}
    \label{fig:your_label}
\end{figure}
```

### Step 5: Add References
Edit `sections/references.tex` and add your citations in IEEE format.
You can also switch to BibTeX by creating a `.bib` file.

## 📋 Template Contents

| Section | Description |
|---------|-------------|
| Cover Page | Title, supervisor, student info, university logo |
| Approval | Board of Examiners signatures |
| Declaration | Student declaration of originality |
| Acknowledgement | Gratitude section |
| Table of Contents | Auto-generated |
| List of Tables | Auto-generated |
| List of Figures | Auto-generated |
| List of Acronyms | Manual list of abbreviations |
| Proposal Summary | 200-300 word overview (renamed from Abstract) |
| 1. Introduction | Background, Significance, Motivation |
| 2. Problem Statement | Challenge, Importance, Context |
| 3. Research Questions | Structured table (RQ + Motivation) |
| 4. Research Objectives | SMART objectives list |
| 5. Rationale | Justification for the study |
| 6. Literature Review | Related work, Comparison table, Summary |
| 7. Research Gap | Identified gaps, Novelty |
| 8. Proposed Methodology | Approach, Data, Model, Metrics, Tools, Ethics |
| 9. Expected Outcomes | Anticipated deliverables |
| 10. Work Plan | Gantt chart timeline |
| 11. Budget | Optional cost breakdown |
| References | IEEE-style bibliography |
| Appendices | Supplementary materials |

## 🎨 Formatting

- **Font:** Times New Roman, 12pt
- **Spacing:** 1.5 line spacing
- **Margins:** 1 inch all sides
- **Footer:** `© Department of Computer Science and Engineering, RMSTU`
- **Header:** `BSc Thesis Proposal | Dept. of CSE, RMSTU`
- **Citation Style:** IEEE (numbered)

## ⚠️ Important Notes

- The gray placeholder text is for guidance only — **delete it** when writing your content
- Compile **twice** to generate correct Table of Contents and cross-references
- The `\gantt` command in the timeline table creates shaded cells — use it to mark active months
- Uncomment the algorithm and figure examples in `08_methodology.tex` when ready

---

**Template prepared for the Department of CSE, RMSTU**  
**Feel free to modify and distribute among classmates!**
