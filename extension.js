
var vscode = require('vscode');

function activate(ctx) {

    var key = 'markdown.images.library';
    var url = encodeURI(vscode.workspace.getConfiguration(key).get('url') || '');

    ctx.subscriptions.push(vscode.workspace.onDidChangeConfiguration(function (e) {
        if (e.affectsConfiguration(key)) {
            url = encodeURI(vscode.workspace.getConfiguration(key).get('url') || '');
            vscode.commands.executeCommand('markdown.preview.refresh');
        }
    }));

    return {
        extendMarkdownIt: function (md) {

            var renderImage = md.renderer.rules.image;

            md.renderer.rules.image = function (tokens, idx, options, env, self) {

                var token = tokens[idx],
                    i = token.attrIndex('src'),
                    src = token.attrs[i][1] || '';

                if (url && src.startsWith('!')) {
                    token.attrs[i][1] = url + src.substr(1);
                }

                return renderImage(tokens, idx, options, env, self);
            };

            return md;
        }
    };
}

module.exports = { activate };