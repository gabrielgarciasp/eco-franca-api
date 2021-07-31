export default (first_name: string, urlChangePassword: string): string => {
    return `
        <head>
            <style>
                div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                a{
                    background-color: #00ADB5; /* Green */
                    font-family: Arial, Helvetica, sans-serif;
                    border: none;
                    color: white;
                    padding: 7.5px 16px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                    transition-duration: 0.5s;
                    cursor: pointer;
                    align-items: center;
                }

                a:hover {
                    background-color: #AAD8D3; /* Green */
                    color: black;
                }

                td {
                    padding: 10px;
                    text-align: center;
                }

                h1 {
                    font-size: 26px;
                    font-family: Arial, Helvetica, sans-serif;
                }

                p {
                    font-size: 14px;
                    font-family: Arial, Helvetica, sans-serif;
                }


            </style>
        </head>

        <body>
            <div>
                <table>
                    <tr>
                        <td>
                            <h1>
                                Olá, ${first_name}
                            </h1>
                        </td>
                    </tr>
                
                    <tr>
                        <td>
                            <p>
                                Houve uma solicitação de senha.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p>
                                Caso tenha sido você clique no botão abaixo para recuperar a sua senha, caso contrario apenas ignore o e-mail.
                            </p>
                        </td>
                    </tr>

                    <tr >
                        <td >
                            <a href="${urlChangePassword}" target="_blank">Esqueci Minha Senha</a>
                        </td>
                    </tr>
                </div>

                </table>
            </div>
        </body>
    `
}
