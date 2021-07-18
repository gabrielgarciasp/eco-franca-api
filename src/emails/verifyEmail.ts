export default (first_name: string, hash: string): string => {
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
                    padding: 10px 20px;
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
                <form method="POST">
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
                                    Agradecemos por registrar uma conta no Eco Franca! Antes de começarmos, precisamos confirmar que é você
                                    mesmo.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p>
                                    Clique abaixo para verificar seu endereço de e-mail:
                                </p>
                            </td>
                        </tr>

                        <tr >
                            <td >
                                <a href="${process.env.URL_VERIFY_EMAIL}/${hash}" target="_blank">Verificar e-mail </a>
                            </td>
                        </tr>
                    </div>

                    </table>
                </form>
            </div>
        </body>
    `
}
