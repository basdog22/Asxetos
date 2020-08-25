/**************************************
 Webutler V2.1 - www.webutler.de
 Copyright (c) 2008 - 2011
 Autor: Sven Zinke
 Free for any use
 Lizenz: GPL
 **************************************/

(function () {
    CKEDITOR.plugins.add('internpage');

    CKEDITOR.on('dialogDefinition', function (a) {
        var b = a.data.name, c = a.data.definition, d = a.editor;
        if (b == 'link') {
            var e = c.getContents('info');
            var result = new Array( new Array( '', '' ));
            for (var i=0; i<ASXETOS.pageslist.length; i++) {
                result.push(new Array( ASXETOS.pageslist[i].title, ASXETOS.pageslist[i].value.replace(ASXETOS.asxetos_url+"/","") ));
            }
            e.add({
                type: 'select',
                id: 'intern',
                label: t('Internal page'),
                'default': '',
                style: 'width:100%',
                items: result,
                onChange: function () {
                    var f = CKEDITOR.dialog.getCurrent();
                    f.setValueOf('info', 'url', this.getValue());
                    f.setValueOf('info', 'protocol', !this.getValue() ? 'http://' : '');
                },
                setup: function (f) {
                    this.allowOnChange = false;
                    this.setValue(f.url ? f.url.url : '');
                    this.allowOnChange = true;
                }
            }, 'browse');
            c.onLoad = function () {
                var f = this.getContentElement('info', 'intern');
                f.reset();
            };
        }
    });
})();
