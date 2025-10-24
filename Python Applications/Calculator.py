def Calculate():
    a=float(input("Enter operand a: "))
    b=float(input("Enter operand b: "))
    c=input("Enter the operator: ")
    if c=="+":
        print("Result : ",a+b)
    elif c=="-":
        print("Result : ",a-b)
    elif c=="*":
        print("Result : ",a*b)  
    elif c=="/":
        print("Result : ",a/b)   
    elif c=="%":
        print("Result : ",a%b)  
    else:
        print("Invalid Operator")         
            
Calculate()    