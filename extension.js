const vscode = require('vscode');

const db = new Map(); // Database for Base64 content

function activate(context) {
	const fold_cmd = vscode.commands.registerCommand('b64folder.fold', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) 
			fold(editor).then(() => editor.document.save());
		else
			vscode.window.showErrorMessage('No active editor!');
	});
	const unfold_cmd = vscode.commands.registerCommand('b64folder.unfold', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor)
			unfold(editor).then(() => editor.document.save());
		else
			vscode.window.showErrorMessage('No active editor!');
	});
	const onsave_listener = vscode.workspace.onWillSaveTextDocument((e) => {
		const editor = vscode.window.activeTextEditor;

		if (editor && editor.document === e.document)
			fold(editor).then(() => editor.document.save());
	});
	const onclose_listener = vscode.window.onDidChangeActiveTextEditor(() => {
		if (db.size > 0)
			unfold(vscode.window.activeTextEditor);
	});

	vscode.window.showInformationMessage('Base64 folder extension is now active!');
	context.subscriptions.push(fold_cmd, unfold_cmd, onsave_listener, onclose_listener);
}

function fold(editor) {
	const doc = editor.document;
	const b64pat = /[A-Za-z0-9+/=]{50,}/g;
	const edit = new vscode.WorkspaceEdit();
	const phold = `[..Base64 collapsed😍]`
	let cnt = 0;

	for (let i = 0; i < doc.lineCount; i++) {
		const line = doc.lineAt(i);
		const matches = line.text.matchAll(b64pat);

		if (matches)
			for (const match of matches) {
				const start = new vscode.Position(i, match.index);
				const end = new vscode.Position(i, match.index + match[0].length);
				const range = new vscode.Range(start, end);
				const key = `${doc.uri}*${start.line}*${start.character}`;

				db.set(key, doc.getText(range));
				edit.replace(doc.uri, range, phold);
				cnt++;
			}
	}

	return vscode.workspace.applyEdit(edit).then(() => {
		vscode.window.showInformationMessage(`Folded ${cnt} Base64 strings!`);
	});
}

function unfold(editor) {
	const doc = editor.document;
	const edit = new vscode.WorkspaceEdit();
	let cnt = 0;

	console.log("FUCK1");
	for (const [key, value] of db) {
		const [uri, line, char] = key.split('*');
		const start = new vscode.Position(parseInt(line), parseInt(char));
		const range = new vscode.Range(start, start.translate(0, 12));

		console.log(`fuck ${uri} ${doc.uri.toString()}`);
		if (uri == doc.uri.toString()) {
			edit.replace(doc.uri, range, value);
			db.delete(key);
			cnt++;
		}
	}

	return vscode.workspace.applyEdit(edit).then(() => vscode.window.showInformationMessage(`Unfolded ${cnt} Base64 strings!`));
}

function deactivate() {
	vscode.window.showInformationMessage('Base64 folder extension is now inactive!');
}

module.exports = {
	activate,
	deactivate,
};