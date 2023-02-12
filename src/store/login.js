import $ from 'jquery';

const ModuleLogin = {
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
        login(context, data) {
            $.ajax ({
                url: "https://kanghui29.cn/api/test/hello",
                type: "GET",
                data: {
                },
                contentType: "application/json",
                success(resp) {
                    data.success(resp);
                },
                error() {
                    data.error();
                }
            });
        },
    },
    modules: {
    }
};

export default ModuleLogin;