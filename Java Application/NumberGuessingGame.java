import java.util.Random;
import java.util.Scanner;

public class NumberGuessingGame {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Random random = new Random();

        int totalScore = 0;
        boolean playAgain = true;

        System.out.println("Welcome to the Number Guessing Game!");

        while (playAgain) {
            int numberToGuess = random.nextInt(100) + 1; // random number 1–100
            int attemptsLeft = 7; // max attempts
            boolean guessedCorrectly = false;

            System.out.println("\nI have chosen a number between 1 and 100.");
            System.out.println("You have " + attemptsLeft + " attempts to guess it!");

            while (attemptsLeft > 0) {
                System.out.print("\nEnter your guess: ");
                int userGuess;

                // Validate input
                if (sc.hasNextInt()) {
                    userGuess = sc.nextInt();
                } else {
                    System.out.println("Please enter a valid number!");
                    sc.next(); // clear invalid input
                    continue;
                }

                attemptsLeft--;

                if (userGuess == numberToGuess) {
                    System.out.println(" Correct! You guessed the number!");
                    guessedCorrectly = true;
                    totalScore += attemptsLeft + 1; // bonus: fewer attempts = higher score
                    break;
                } else if (userGuess > numberToGuess) {
                    System.out.println("⬇Too high! Try again.");
                } else {
                    System.out.println("⬆Too low! Try again.");
                }

                System.out.println("Attempts left: " + attemptsLeft);
            }

            if (!guessedCorrectly) {
                System.out.println("\n You've run out of attempts! The number was: " + numberToGuess);
            }

            System.out.println("\nYour current score: " + totalScore);
            System.out.print("Do you want to play another round? (yes/no): ");
            String response = sc.next().toLowerCase();

            playAgain = response.equals("yes") || response.equals("y");
        }

        System.out.println("\n Game Over! Your final score: " + totalScore);
        System.out.println("Thanks for playing!");
        sc.close();
    }
}
