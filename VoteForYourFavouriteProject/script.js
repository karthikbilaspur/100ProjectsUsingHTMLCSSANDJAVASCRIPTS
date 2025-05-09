
class VotingSystem {
    constructor() {
        this.voteCounts = {
            project1: document.getElementById('project1-votes'),
            project2: document.getElementById('project2-votes'),
            project3: document.getElementById('project3-votes'),
            project4: document.getElementById('project4-votes'),
            project5: document.getElementById('project5-votes'),
            project6: document.getElementById('project6-votes'),
        };
        this.alertElement = document.getElementById('alert');
        this.chartElement = document.getElementById('results-chart');
        this.votes = this.loadVotes();
        this.chart = this.createChart();
        this.initEventListeners();
        this.updateVoteCounts();
    }

    loadVotes() {
        const storedVotes = localStorage.getItem('votes');
        return storedVotes ? JSON.parse(storedVotes) : { project1: 0, project2: 0, project3: 0, project4: 0, project5: 0, project6: 0 };
    }

    saveVotes() {
        localStorage.setItem('votes', JSON.stringify(this.votes));
    }

    createChart() {
        const ctx = this.chartElement.getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Project 6'],
                datasets: [{
                    label: 'Votes',
                    data: [this.votes.project1, this.votes.project2, this.votes.project3, this.votes.project4, this.votes.project5, this.votes.project6],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initEventListeners() {
        document.querySelectorAll('.vote-btn').forEach(button => {
            button.addEventListener('click', () => {
                const project = button.getAttribute('data-project');
                this.votes[project]++;
                this.saveVotes();
                this.updateVoteCounts();
                this.chart.data.datasets[0].data = [this.votes.project1, this.votes.project2, this.votes.project3, this.votes.project4, this.votes.project5, this.votes.project6];
                this.chart.update();
                this.showAlert(`Thank you for voting for ${project}!`);
            });
        });

        document.getElementById('reset-votes-btn').addEventListener('click', () => {
            this.votes = { project1: 0, project2: 0, project3: 0, project4: 0, project5: 0, project6: 0 };
            this.saveVotes();
            this.updateVoteCounts();
            this.chart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
            this.chart.update();
            this.showAlert('Votes reset successfully!');
        });

        document.getElementById('view-votes-btn').addEventListener('click', () => {
            console.log(this.votes);
            this.showAlert(`Project 1: ${this.votes.project1} votes, Project 2: ${this.votes.project2} votes, Project 3: ${this.votes.project3} votes, Project 4: ${this.votes.project4} votes, Project 5: ${this.votes.project5} votes, Project 6: ${this.votes.project6} votes`);
        });
    }

    updateVoteCounts() {
        this.voteCounts.project1.textContent = this.votes.project1;
        this.voteCounts.project2.textContent = this.votes.project2;
        this.voteCounts.project3.textContent = this.votes.project3;
        this.voteCounts.project4.textContent = this.votes.project4;
        this.voteCounts.project5.textContent = this.votes.project5;
        this.voteCounts.project6.textContent = this.votes.project6;
    }

    showAlert(message) {
        this.alertElement.textContent = message;
        this.alertElement.classList.add('alert-success');
        this.alertElement.style.display = 'block';
        setTimeout(() => {
            this.alertElement.style.display = 'none';
            this.alertElement.classList.remove('alert-success');
        }, 2000);
    }
}

new VotingSystem();