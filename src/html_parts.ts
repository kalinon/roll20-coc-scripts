// Roll20 available html tags
// <code><span><div><label><a><br><br /><p><b><i><del><strike><u><img>
// <blockquote><mark><cite><small><ul><ol><li><hr><dl><dt><dd><sup>
// <sub><big><pre><figure><figcaption><strong><em><table><tr><td><th>
// <tbody><thead><tfoot><h1><h2><h3><h4><h5><h6>

class HtmlParts {
    public static elder_sign = `<img src="${ICONS.elder}" style="height: 25px">`;
    public static colors = ['cornflowerblue', 'cadetblue', 'darkslategray', 'teal', 'darkgreen', 'firebrick']

    private static _cur_color = 0;

    public static get randomColor(): string {
        return this.colors[randomInteger(this.colors.length)];
    }

    public static get nextColor(): string {
        let color = this.colors[this._cur_color];
        this._cur_color += 1;
        if (this._cur_color >= this.colors.length) {
            this._cur_color = 0;
        }
        return color;
    }

    public static get divider(): string {
        return `<div style="padding: 10px; text-align: center; background-color: ${this.nextColor}">` +
            `${HtmlParts.elder_sign}${HtmlParts.elder_sign}${HtmlParts.elder_sign}${HtmlParts.elder_sign}${HtmlParts.elder_sign}</div>`;
    }
}
