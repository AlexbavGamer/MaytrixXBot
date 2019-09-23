require.config({ paths: { 'vs': '../node_modules/monaco-editor/min/vs' }});

require(['vs/editor/editor.main'], function()
{
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES6,
            allowNonTsExtensions: true,
            esModuleInterop: true,
        });

        var parsed = {
            key: "",
            value: ""
        };
        data.dependencies.forEach((value, key) => {
            parsed.value = JSON.stringify(value)
            parsed.key = JSON.stringify(key)
            monaco.languages.typescript.typescriptDefaults.addExtraLib(parsed.value, parsed.key);
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2016,
            allowNonTsExtensions: true,
            module: monaco.languages.typescript.ModuleKind.CommonJS,
            noEmit: true,
            esModuleInterop: true,
        });

        editor = monaco.editor.create(document.getElementById("container"), {
            model: monaco.editor.createModel(jsCode,"typescript"),
            theme: "vs-dark",
            autoIndent: true
        });

});