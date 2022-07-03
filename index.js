//<----------------------------------- Modulos Externos --------------------------------------->
const inquirer = require("inquirer");
const chalk = require("chalk");

// <----------------------------------- Modulos internos --------------------------------------->

const fs = require("fs");
const { clear } = require("console");
console.log("Iniciamos o Accounts!");
operation();

//<--------------------------------- MAIN MENU --------------------------------------->

//open the account main Menu!

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      if (action == "Criar Conta") {
        createAccount();
      } else if (action == "Consultar Saldo") {
        consultarSaldo();
      } else if (action == "Depositar") {
        depositarValor();
      } else if (action == "Sacar") {
        sacarValor();
      } else if (action == "Sair") {
        sairDoPrograma();
      }
    })
    .catch((err) => console.log(err));
}

// <----------------------- ACCOUNT CREATION SECTION ------------------------->

// Create an account!

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso Banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));
  buildAccount();
}

// <------------------------------ Create a New account and putting in a json file ----------------------------------------------->

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome para a conta:",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      console.info(accountName);
      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }
      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("Ja existe essa conta!"));
        buildAccount();
        return;
      }
      fs.writeFileSync(
        `accounts/${accountName}.json`,
        `{"balance": 0}`,
        function (err) {
          console.log(err);
        }
      );
      console.log(chalk.green("Parabéns, a sua conta foi criada!"));
      operation();
    })
    .catch((err) => console.log(err));
}

// <------------------------------ MONETARY AND ACTIONS SECTION -------------------------------->

//Check the Balance on the account!

function consultarSaldo() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      //Verify if account exists

      if (!checkAccount(accountName)) {
        return consultarSaldo();
      }

      const accountData = getAccount(accountName);
      console.log(
        chalk.bgBlue.black(`Seu saldo é de: R$${accountData.balance}`)
      );
      operation();
    })
    .catch((err) => console.log(err));
}
// <----------------------------------- Deposit new funds on the account ----------------------------------------------->

// A function that deposits the value on the account

function depositarValor() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      //verify if account exist
      if (!checkAccount(accountName)) {
        return depositarValor();
      }
      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          //Add an amount
          addAmount(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

// A function to check if the account exist in our system

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Essa conta não exite, tente novamente!"));
    return false;
  }
  return true;
}

// A function that gets the amount deposite in the account chosen

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);
  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
    return depositarValor;
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );
  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
  );
}

// A function that pickup the account from our Json files

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
}

// <----------------------------------- whithdraw the funds of the accounts ----------------------------------------------->

function sacarValor() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checkAccount(accountName)) {
        return sacarValor();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja sacar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];
          removeAmount(accountName, amount);
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.log(err));
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"));
    return sacarValor();
  }
  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black("Valor indisponível!"));
    return sacarValor();
  }
  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );
  console.log(
    chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`),
    chalk.green(`Saldo restante é de: R$${accountData.balance}`)
  );
  operation();
}

// <----------------------- END SECTION ------------------->

// End the system!

function sairDoPrograma() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actionExit",
        message: "Deseja realmente sair do programa?",
        choices: ["Sim", "Não"],
      },
    ])
    .then((answer) => {
      const actionExit = answer["actionExit"];
      if (actionExit == "Sim") {
        console.log(chalk.green("Até Mais!"));
        console.clear();
        process.exit();
      } else if (actionExit == "Não") {
        operation();
      }
    })
    .catch((err) => console.log(err));
}
