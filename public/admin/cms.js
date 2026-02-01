/**
 * Thalita Portfolio - CMS Customizations
 * Using Decap CMS (fka Netlify CMS) SDK
 */

// register global styles into the preview pane
CMS.registerPreviewStyle("/admin/admin-preview.css");

// Project Preview Template
const ProjectPreview = createClass({
    render: function () {
        const entry = this.props.entry;
        const title = entry.getIn(['data', 'title']);
        const client = entry.getIn(['data', 'client']);
        const role = entry.getIn(['data', 'role']);
        const categories = entry.getIn(['data', 'categories']);
        const body = entry.getIn(['data', 'body']);
        const coverImage = entry.getIn(['data', 'coverImage']);
        const gallery = entry.getIn(['data', 'gallery']);
        const credits = entry.getIn(['data', 'credits']);

        return h('div', { className: 'portfolio-preview' },
            // Header Section
            h('header', { className: 'preview-header' },
                h('h1', {}, title || 'Project Title'),
                client && h('p', { className: 'client' }, h('strong', {}, 'Client: '), client),
                role && h('p', { className: 'role' }, h('strong', {}, 'Role: '), role)
            ),

            // Media Section
            coverImage && h('div', { className: 'main-image' },
                h('img', { src: this.props.getAsset(coverImage).toString() })
            ),

            // Content Section
            h('div', { className: 'content' },
                this.props.widgetFor('body')
            ),

            // Gallery Grid
            gallery && h('div', { className: 'gallery-grid' },
                gallery.map((item, index) => h('div', { key: index, className: 'gallery-item' },
                    h('img', { src: this.props.getAsset(item.get('src')).toString() })
                ))
            ),

            // Credits Section
            credits && h('div', { className: 'credits' },
                h('h3', {}, 'Credits'),
                credits.map((item, index) => h('p', { key: index },
                    h('span', { className: 'credit-role' }, item.get('role') + ': '),
                    h('span', { className: 'credit-name' }, item.get('name'))
                ))
            )
        );
    }
});

CMS.registerPreviewTemplate("projects", ProjectPreview);
