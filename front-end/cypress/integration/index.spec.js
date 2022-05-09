describe("insert song", () => {
  const songList = {
    "Fluorescent Adolescent": "https://www.youtube.com/watch?v=ma9I9VBKPiw",
    "Ain't It Fun": "https://www.youtube.com/watch?v=EFEmTsfFL5A",
    "That's Life": "https://www.youtube.com/watch?v=TnlPtaPxXfc",
    DNA: "https://www.youtube.com/watch?v=NLZRYQMLDW4",
    Changes: "https://www.youtube.com/watch?v=eXvBjCO19QY",
    Mockingbird: "https://www.youtube.com/watch?v=S9bCLPwzSC0",
  };
  function songRandomizer(lst) {
    const songNames = Object.keys(lst);
    const songLinks = Object.values(lst);
    const index = Math.floor(Math.random() * (5 + 1));
    return { [songNames[index]]: songLinks[index] };
  }
  it("should insert a new song", () => {
    const song = songRandomizer(songList);
    const [songName] = Object.keys(song);
    const [songLink] = Object.values(song);

    cy.visit("http://localhost:3000/");
    cy.get("input[placeholder = Name]").type(songName);
    cy.get("input[type = url]").type(songLink);
    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "recommendation"
    );
    cy.get("button").click();
    cy.wait("@recommendation");

    cy.contains(songName).should("be.visible");
  });
});
