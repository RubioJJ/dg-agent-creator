const MODULE_ID = "dg-agent-creator";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Inicializado`);
});

class DGAgentCreator extends Application {

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      id: "dg-agent-creator",
      title: "DG Agent Creator",
      template: `modules/${MODULE_ID}/templates/creator.html`,
      width: 500,
      height: 600,
      resizable: false
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("#roll-attributes").click(() => {
      this.rollAttributes(html);
    });

    html.find("#create-agent").click(() => {
      this.createAgent(html);
    });
  }

  rollAttributes(html) {
    const stats = ["str","con","dex","int","pow","cha"];

    stats.forEach(stat => {
      const value = (Math.floor(Math.random() * 6) + 1) +
                    (Math.floor(Math.random() * 6) + 1) +
                    (Math.floor(Math.random() * 6) + 1);
      html.find(`input[name="${stat}"]`).val(value * 5);
    });
  }

  async createAgent(html) {

    const name = html.find('input[name="name"]').val() || "Novo Agente";

    const data = {
      type: "agent",
      name: name,
      system: {
        statistics: {
          str: { value: Number(html.find('input[name="str"]').val()) },
          con: { value: Number(html.find('input[name="con"]').val()) },
          dex: { value: Number(html.find('input[name="dex"]').val()) },
          int: { value: Number(html.find('input[name="int"]').val()) },
          pow: { value: Number(html.find('input[name="pow"]').val()) },
          cha: { value: Number(html.find('input[name="cha"]').val()) }
        }
      }
    };

    await Actor.create(data);

    ui.notifications.info("Agente criado com sucesso!");
    this.close();
  }
}

Hooks.once("ready", () => {
  game.dggenerator = new DGAgentCreator();
});

Hooks.on("getSceneControlButtons", controls => {
  controls.push({
    name: "dg-agent-creator",
    title: "DG Agent Creator",
    icon: "fas fa-user-secret",
    layer: "TokenLayer",
    tools: [{
      name: "open-creator",
      title: "Criar Agente",
      icon: "fas fa-user-plus",
      onClick: () => {
        new DGAgentCreator().render(true);
      },
      button: true
    }]
  });
});
