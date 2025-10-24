import random


choices = ["rock", "paper", "scissors"]


computer = random.choice(choices)


user = input("Enter rock, paper, or scissors: ").lower()

print(f"\nYou chose: {user}")
print(f"Computer chose: {computer}\n")


if user == computer:
    print("It's a tie!")
elif (user == "rock" and computer == "scissors") or \
     (user == "paper" and computer == "rock") or \
     (user == "scissors" and computer == "paper"):
    print("You win! ")
elif user in choices:
    print("Computer wins! ")
else:
    print("Invalid input! Please enter rock, paper, or scissors.")
