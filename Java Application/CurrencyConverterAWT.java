import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.net.*;
import org.json.JSONObject; 

public class CurrencyConverterAWT extends Frame implements ActionListener {
    Label l1, l2, l3, resultLabel;
    TextField amountField;
    Choice baseCurrency, targetCurrency;
    Button convertButton;

    CurrencyConverterAWT() {
        setTitle("Currency Converter");
        setLayout(null);
        setSize(450, 350);
        setBackground(new Color(230, 245, 250));

        l1 = new Label("Enter Amount:");
        l1.setBounds(70, 70, 100, 25);
        add(l1);

        amountField = new TextField();
        amountField.setBounds(180, 70, 150, 25);
        add(amountField);

        l2 = new Label("From Currency:");
        l2.setBounds(70, 110, 100, 25);
        add(l2);

        baseCurrency = new Choice();
        baseCurrency.add("USD");
        baseCurrency.add("INR");
        baseCurrency.add("EUR");
        baseCurrency.add("GBP");
        baseCurrency.add("JPY");
        baseCurrency.add("AUD");
        baseCurrency.setBounds(180, 110, 100, 25);
        add(baseCurrency);

        l3 = new Label("To Currency:");
        l3.setBounds(70, 150, 100, 25);
        add(l3);

        targetCurrency = new Choice();
        targetCurrency.add("INR");
        targetCurrency.add("USD");
        targetCurrency.add("EUR");
        targetCurrency.add("GBP");
        targetCurrency.add("JPY");
        targetCurrency.add("AUD");
        targetCurrency.setBounds(180, 150, 100, 25);
        add(targetCurrency);

        convertButton = new Button("Convert");
        convertButton.setBounds(160, 200, 100, 40);
        convertButton.setBackground(new Color(51, 153, 255));
        convertButton.setForeground(Color.white);
        add(convertButton);

        resultLabel = new Label("Converted Amount: ");
        resultLabel.setBounds(100, 260, 300, 25);
        add(resultLabel);

        convertButton.addActionListener(this);

        addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent we) {
                dispose();
            }
        });

        setVisible(true);
    }

    public void actionPerformed(ActionEvent e) {
        try {
            double amount = Double.parseDouble(amountField.getText());
            String from = baseCurrency.getSelectedItem();
            String to = targetCurrency.getSelectedItem();

            double rate = fetchExchangeRate(from, to);
            double convertedAmount = amount * rate;

            resultLabel.setText(String.format("Converted Amount: %.2f %s", convertedAmount, to));
        } catch (NumberFormatException ex) {
            resultLabel.setText("Please enter a valid amount!");
        } catch (Exception ex) {
            resultLabel.setText("Error fetching exchange rate.");
            ex.printStackTrace();
        }
    }

    private double fetchExchangeRate(String from, String to) throws Exception {
        String urlStr = "https://api.exchangerate.host/latest?base=" + from + "&symbols=" + to;
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = in.readLine()) != null) {
            response.append(line);
        }
        in.close();

        JSONObject json = new JSONObject(response.toString());
        JSONObject rates = json.getJSONObject("rates");
        return rates.getDouble(to);
    }

    public static void main(String[] args) {
        // To use JSONObject, you must add org.json.jar to your classpath.
        new CurrencyConverterAWT();
    }
}

