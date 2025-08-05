document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('documentEditor');
    if (!editor) return;

    // --- TEMPLATES (Restored) ---
    const templates = {
        notice: `
            <h1>LEGAL NOTICE</h1>
            <p><strong>Date:</strong> [Date]</p>
            <p><strong>To:</strong> [Recipient's Name/Address]</p>
            <p><strong>From:</strong> [Your Name/Address]</p>
            <hr>
            <p>Under instructions from and on behalf of my client, [Your Client's Name], I do hereby serve you with the following legal notice...</p>
            <br><p>Sincerely,</p>
            <p>[Your Name]</p>
        `,
        will: `
            <h1>LAST WILL AND TESTAMENT</h1>
            <p>I, [Your Full Name], residing at [Your Address], being of sound mind and not acting under duress or undue influence, do hereby make, publish, and declare this to be my Last Will and Testament.</p>
            <h2>I. EXECUTOR</h2>
            <p>I hereby nominate and appoint [Executor's Name] as Executor of this Will.</p>
            <h2>II. DISTRIBUTION OF ASSETS</h2>
            <p>[Specify how your assets will be distributed...]</p>
        `,
        nda: `
            <h1>NON-DISCLOSURE AGREEMENT</h1>
            <p>This Non-Disclosure Agreement (the "Agreement") is entered into as of [Date] by and between [Disclosing Party Name] ("Disclosing Party") and [Receiving Party Name] ("Receiving Party").</p>
            <p>The parties agree to enter into a confidential relationship with respect to the disclosure of certain proprietary and confidential information...</p>
        `,
        lease: `
            <h1>RENTAL LEASE AGREEMENT</h1>
            <p>This Lease Agreement is made on [Date] between [Landlord's Name] ("Landlord") and [Tenant's Name] ("Tenant").</p>
            <h2>1. PROPERTY</h2>
            <p>Landlord agrees to lease the property located at [Property Address] to the Tenant.</p>
            <h2>2. TERM</h2>
            <p>The term of this lease shall be for [Lease Term], beginning on [Start Date] and ending on [End Date].</p>
        `,
        complaint: `
            <h1>PLAINTIFF'S COMPLAINT</h1>
            <p>Case No. [Case Number]</p>
            <p>Plaintiff, [Plaintiff's Name], by and through their undersigned counsel, files this Complaint against Defendant, [Defendant's Name], and alleges as follows:</p>
            <h2>I. JURISDICTION AND VENUE</h2>
            <p>[State the basis for the court's jurisdiction...]</p>
            <h2>II. CAUSE OF ACTION</h2>
            <p>[Describe the legal claims...]</p>
        `
    };

    // --- PAGE INITIALIZATION ---
    const urlParams = new URLSearchParams(window.location.search);
    const docType = urlParams.get('doc') || 'notice';
    const savedContent = localStorage.getItem(`doc_${docType}`);
    editor.innerHTML = savedContent || templates[docType] || '<p>Start writing your document...</p>';

    // --- TOOLBAR FUNCTIONALITY ---
    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    // Standard Buttons
    document.getElementById('boldBtn').addEventListener('click', () => execCmd('bold'));
    document.getElementById('italicBtn').addEventListener('click', () => execCmd('italic'));
    document.getElementById('underlineBtn').addEventListener('click', () => execCmd('underline'));
    document.getElementById('alignLeftBtn').addEventListener('click', () => execCmd('justifyLeft'));
    document.getElementById('alignCenterBtn').addEventListener('click', () => execCmd('justifyCenter'));
    document.getElementById('alignRightBtn').addEventListener('click', () => execCmd('justifyRight'));
    document.getElementById('undoBtn').addEventListener('click', () => execCmd('undo'));
    document.getElementById('redoBtn').addEventListener('click', () => execCmd('redo'));
    
    // --- NEW FEATURES START ---

    // Strikethrough, Lists, and Clear Formatting
    document.getElementById('strikethroughBtn').addEventListener('click', () => execCmd('strikeThrough'));
    document.getElementById('orderedListBtn').addEventListener('click', () => execCmd('insertOrderedList'));
    document.getElementById('unorderedListBtn').addEventListener('click', () => execCmd('insertUnorderedList'));
    document.getElementById('clearFormattingBtn').addEventListener('click', () => execCmd('removeFormat'));

    // Font Family
    document.getElementById('fontFamilySelect').addEventListener('change', (e) => {
        execCmd('fontName', e.target.value);
    });

    // Font Size
    document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
        execCmd('fontSize', e.target.value);
    });

    // Font Color
    document.getElementById('fontColorPicker').addEventListener('input', (e) => {
        execCmd('foreColor', e.target.value);
    });

    // Highlight Color
    document.getElementById('highlightColorPicker').addEventListener('input', (e) => {
        execCmd('hiliteColor', e.target.value);
    });

    // Word and Character Count
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');

    const updateCounts = () => {
        if (!editor.innerText) return;
        const text = editor.innerText;
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        charCountEl.textContent = `Characters: ${charCount}`;
        wordCountEl.textContent = `Words: ${wordCount}`;
    };

    editor.addEventListener('keyup', updateCounts);
    updateCounts();

    // --- NEW FEATURES END ---

    // --- SAVE AND DOWNLOAD ---
    document.getElementById('saveBtn').addEventListener('click', () => {
        localStorage.setItem(`doc_${docType}`, editor.innerHTML);
        alert('Document saved locally!');
    });

    document.getElementById('downloadTxtBtn').addEventListener('click', () => {
        const content = editor.innerText;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docType}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('downloadDocxBtn').addEventListener('click', () => {
        const content = editor.innerHTML;
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${content}</body></html>`;
        const blob = htmlDocx.asBlob(fullHtml);
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docType}.docx`;
        a.click();
        URL.revokeObjectURL(url);
    });
});